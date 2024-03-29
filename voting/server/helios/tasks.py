"""
Celery queued tasks for Helios

2010-08-01
ben@adida.net
"""
import copy
from celery import shared_task
from celery.utils.log import get_logger

from . import signals
from .models import CastVote, Election, Voter, VoterFile, VoterSnapshot
from .view_utils import render_template_raw

import blockfrost
from cardano_python_utils.util import ShelleyAddress

import urllib.request, json 
from settings import BLOCKFROST_API_KEY

BF = blockfrost.BlockFrostApi(BLOCKFROST_API_KEY)
MILK_POLICY_ID = '8a1cfae21368b8bebbbed9800fec304e95cce39a2a57dc35e2e3ebaa'
MILK_TOKEN_NAME_HEX = '4d494c4b'
MILK_STAKERS_ENDPOINT = "http://staking.muesliswap.com/milk-stakers"


@shared_task
def cast_vote_verify_and_store(cast_vote_id, status_update_message=None, **kwargs):
    cast_vote = CastVote.objects.get(id=cast_vote_id)
    result = cast_vote.verify_and_store()

    voter = cast_vote.voter
    election = voter.election
    user = voter.get_user()

    if result:
        # send the signal
        signals.vote_cast.send(sender=election, election=election, user=user, voter=voter, cast_vote=cast_vote)

        if status_update_message and user.can_update_status():
            user.update_status(status_update_message)
    else:
        logger = get_logger(cast_vote_verify_and_store.__name__)
        logger.error("Failed to verify and store %d" % cast_vote_id)


@shared_task
def voters_email(election_id, subject_template, body_template, extra_vars={},
                 voter_constraints_include=None, voter_constraints_exclude=None):
    """
    voter_constraints_include are conditions on including voters
    voter_constraints_exclude are conditions on excluding voters
    """
    election = Election.objects.get(id=election_id)

    # select the right list of voters
    voters = election.voter_set.all()
    if voter_constraints_include:
        voters = voters.filter(**voter_constraints_include)
    if voter_constraints_exclude:
        voters = voters.exclude(**voter_constraints_exclude)

    for voter in voters:
        single_voter_email.delay(voter.uuid, subject_template, body_template, extra_vars)


@shared_task
def voters_notify(election_id, notification_template, extra_vars={}):
    election = Election.objects.get(id=election_id)
    for voter in election.voter_set.all():
        single_voter_notify.delay(voter.uuid, notification_template, extra_vars)


@shared_task
def single_voter_email(voter_uuid, subject_template, body_template, extra_vars={}):
    voter = Voter.objects.get(uuid=voter_uuid)

    the_vars = copy.copy(extra_vars)
    the_vars.update({'election': voter.election})
    the_vars.update({'voter': voter})

    subject = render_template_raw(None, subject_template, the_vars)
    body = render_template_raw(None, body_template, the_vars)

    voter.send_message(subject, body)


@shared_task
def single_voter_notify(voter_uuid, notification_template, extra_vars={}):
    voter = Voter.objects.get(uuid=voter_uuid)

    the_vars = copy.copy(extra_vars)
    the_vars.update({'voter': voter})

    notification = render_template_raw(None, notification_template, the_vars)

    voter.send_notification(notification)


@shared_task
def election_compute_tally(election_id):
    election = Election.objects.get(id=election_id)
    election.compute_tally()

    election_notify_admin.delay(election_id=election_id,
                                subject="encrypted tally computed",
                                body="""
The encrypted tally for election %s has been computed.

--
Helios
""" % election.name)

    if election.has_helios_trustee():
        tally_helios_decrypt.delay(election_id=election.id)


@shared_task
def tally_helios_decrypt(election_id):
    election = Election.objects.get(id=election_id)
    election.helios_trustee_decrypt()
    election_notify_admin.delay(election_id=election_id,
                                subject='Helios Decrypt',
                                body="""
Helios has decrypted its portion of the tally
for election %s.

--
Helios
""" % election.name)


@shared_task
def voter_file_process(voter_file_id):
    voter_file = VoterFile.objects.get(id=voter_file_id)
    voter_file.process()
    election_notify_admin.delay(election_id=voter_file.election.id,
                                subject='voter file processed',
                                body="""
Your voter file upload for election %s
has been processed.

%s voters have been created.

--
Helios
""" % (voter_file.election.name, voter_file.num_voters))


@shared_task
def election_notify_admin(election_id, subject, body):
    election = Election.objects.get(id=election_id)
    election.admin.send_message(subject, body)


@shared_task
def do_holder_snapshot(election_id):
    token_amounts = dict()
    i = 1
    while True:
        holders = BF.asset_addresses(asset=MILK_POLICY_ID+MILK_TOKEN_NAME_HEX, page=i)
        if len(holders) == 0:
            break
        for h in holders:
            if not (h.address.startswith('Ae2') or h.address.startswith('DdzFF')):
                try:
                    addr = ShelleyAddress.from_bech32(h.address)
                    if addr.stakekeyhash in token_amounts:
                        token_amounts[addr.stakekeyhash] += int(h.quantity)
                    else:
                        token_amounts[addr.stakekeyhash] = int(h.quantity)
                except NotImplementedError:
                    print("Error decoding address", h.address)
        i += 1

    with urllib.request.urlopen(MILK_STAKERS_ENDPOINT) as req:
        stakes = json.load(req)
    
    for stake in stakes:
        if stake["skh"] in token_amounts:
            token_amounts[stake["skh"]] += int(stake["amount_staked"])
        else:
            token_amounts[stake["skh"]] = int(stake["amount_staked"])

    election = Election.objects.get(id=election_id)
    for skh, amount in token_amounts.items():
        item = VoterSnapshot(
            election=election,
            skh=skh,
            token_quantity=amount
        )
        item.save()