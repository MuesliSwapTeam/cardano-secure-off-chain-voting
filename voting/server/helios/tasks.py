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
from cardano_python_utils.util import Asset, Token
from pycardano import Address

import urllib.request, json
from hashlib import sha256
from collections import defaultdict

#from settings import BLOCKFROST_API_KEY
BLOCKFROST_API_KEY = 'mainnettF41TKBgTJEOmcAva4v7NeuptqV1RD03'

BF = blockfrost.BlockFrostApi(BLOCKFROST_API_KEY)
MILK_POLICY_ID = '8a1cfae21368b8bebbbed9800fec304e95cce39a2a57dc35e2e3ebaa'
MILK_TOKEN_NAME_HEX = '4d494c4b'
MILK_STAKERS_ENDPOINT = "http://staking.muesliswap.com/milk-stakers"
MILK_VAULT_STAKERS_ENDPOINT = "http://staking.muesliswap.com/milk-vault-stakers"
MILK_FARMERS_ENDPOINT = "http://staking.muesliswap.com/milk-farmers"
POOLS_ENDPOINT = "https://api.muesliswap.com/liquidity/pools"

DELEGATION_POLICY_ID = '3c84b8302198a7fe0beaafb9bbefd53010b047413d8832f3a76b9241'

ATALA_DID_NFT_POLICY_ID = '358587601623527cb63a89afba9873a97c407df960d19e21e11f6d15'

def default_weight_function(amount):
    return amount
def quadratic_weight_function(amount):
    return amount ** 2
def constant_weight_function(amount):
    return 1
CUSTOM_WEIGHT_FUNCTION = default_weight_function


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


def is_valid_delegation(delegator: Address, del_asset: Token) -> str:
    # invalid if holder holds more than one delegation token
    # TODO

    # go to some minting tx to obtain non-hashed pkhs of delegator and representative
    mint_tx_hash = [tx.tx_hash for tx in BF.asset_history(del_asset.policy_id + del_asset.name) if tx.action == 'minted'][-1]
    metadata = BF.transaction_metadata(mint_tx_hash)

    del_pkh_labels = [m.json_metadata for m in metadata if m.label == '2001']
    del_skh_labels = [m.json_metadata for m in metadata if m.label == '2002']
    rep_pkh_labels = [m.json_metadata for m in metadata if m.label == '2003']
    rep_skh_labels = [m.json_metadata for m in metadata if m.label == '2004']
    del_pkh = None if len(del_pkh_labels) == 0 else del_pkh_labels[0]
    del_skh = None if len(del_skh_labels) == 0 else del_skh_labels[0]
    rep_pkh = None if len(rep_pkh_labels) == 0 else rep_pkh_labels[0]
    rep_skh = None if len(rep_skh_labels) == 0 else rep_skh_labels[0]

    if None in [del_pkh, del_skh, rep_pkh, rep_skh]:
        return None

    # check if tokenname is hash of del_pkh + rep_pkh
    if del_asset.name != sha256(bytes.fromhex(del_skh) + bytes.fromhex(rep_skh)).hexdigest():
        return None

    # check if holder pkh,skh equals del_pkh,skh
    if str(delegator.payment_part) != del_pkh or str(delegator.staking_part) != del_skh:
        return None
    
    return rep_skh


def get_delegations(eligible_skhs=None):
    delegates_to = dict()
    assets = []
    i = 1
    while True:
        new_assets = BF.assets_policy(policy_id=DELEGATION_POLICY_ID, page=i)
        if len(new_assets) == 0:
            break
        assets += new_assets
        i += 1
    for a in assets:
        bf_asset = BF.asset(asset=a.asset)
        asset = Token(bf_asset.policy_id, bf_asset.asset_name)
        i = 1
        while True:
            holders = BF.asset_addresses(asset=a.asset, page=i)
            if len(holders) == 0:
                break
            for h in holders:
                if not (h.address.startswith('Ae2') or h.address.startswith('DdzFF')):
                    try:
                        addr = Address.decode(h.address)
                        rep_skh = is_valid_delegation(addr, asset)
                        if eligible_skhs is not None and str(addr.staking_part) not in eligible_skhs:
                            continue
                        if rep_skh is not None:
                            # TODO: what if addr already delegates to someone?
                            delegates_to[str(addr.staking_part)] = rep_skh
                    except NotImplementedError:
                        print("Error decoding address", h.address)
            i += 1
    return delegates_to


def get_token_holders(policy_id, tokenname_hex, match_any_tokenname=False):
    if match_any_tokenname:
        j = 1
        tokennames_hex = []
        while True:
            tokens = BF.assets_policy(policy_id, page=j)
            if len(tokens) == 0:
                break
            tokennames_hex += [t.asset[len(policy_id):] for t in tokens]
            j += 1
    else:
        tokennames_hex = [tokenname_hex]

    skh_amounts, pkh_amounts = defaultdict(int), defaultdict(int)
    for tn_hex in tokennames_hex:
        i = 1
        while True:
            holders = BF.asset_addresses(asset=policy_id + tn_hex, page=i)
            if len(holders) == 0:
                break
            for h in holders:
                if not (h.address.startswith("Ae2") or h.address.startswith("DdzFF")):
                    try:
                        addr = Address.decode(h.address)
                        if addr.staking_part is None or str(addr.staking_part) == '':
                            pkh_amounts[str(addr.payment_part)] += int(h.quantity)
                        else:
                            skh_amounts[str(addr.staking_part)] += int(h.quantity)
                    except NotImplementedError:
                        print("Error decoding address", h.address)
            i += 1
    return skh_amounts, pkh_amounts


def get_milk_holders():
    return get_token_holders(MILK_POLICY_ID, MILK_TOKEN_NAME_HEX)


def get_milk_stakers():
    skh_amounts, pkh_amounts = defaultdict(int), defaultdict(int)
    with urllib.request.urlopen(MILK_STAKERS_ENDPOINT) as req:
        stakes = json.load(req)
    with urllib.request.urlopen(MILK_VAULT_STAKERS_ENDPOINT) as req:
        vault_stakes = json.load(req)
    for stake in stakes + vault_stakes:
        skh_amounts[stake["skh"]] += int(stake["amount_staked"])
    return skh_amounts, pkh_amounts


def get_milk_lps():
    skh_amounts, pkh_amounts = defaultdict(int), defaultdict(int)
    with urllib.request.urlopen(POOLS_ENDPOINT) as req:
        pools = json.load(req)
    milk_pools = [
        p
        for p in pools
        if (MILK_POLICY_ID, MILK_TOKEN_NAME_HEX)
        in [
            (p["tokenA"]["address"]["policyId"], p["tokenA"]["address"]["name"]),
            (p["tokenB"]["address"]["policyId"], p["tokenB"]["address"]["name"]),
        ]
    ]
    for mp in milk_pools:
        if mp["lpToken"]["address"] is None:
            continue  # weird wingriders pool with 1 milk and no lp token address
        lp_policyid = mp["lpToken"]["address"]["policyId"]
        lp_tokennamehex = mp["lpToken"]["address"]["name"]
        total_lp_milk = int(
            mp["tokenA"]["amount"]
            if (mp["tokenA"]["address"]["policyId"], mp["tokenA"]["address"]["name"])
            == (MILK_POLICY_ID, MILK_TOKEN_NAME_HEX)
            else mp["tokenB"]["amount"]
        )
        skh_lp_amounts, pkh_lp_amounts = get_token_holders(lp_policyid, lp_tokennamehex)
        # lp_total_amount = int(mp["lpToken"]["amount"])
        lp_total_amount = sum(skh_lp_amounts.values()) + sum(pkh_lp_amounts.values())
        lp_total_bf = int(BF.asset(asset=mp["lpToken"]["address"]["policyId"]+mp["lpToken"]["address"]["name"]).quantity)
        if lp_total_amount != lp_total_bf:
            print('LP amounts to not match!')

        if mp["provider"] == "muesliswap":
            with urllib.request.urlopen(MILK_FARMERS_ENDPOINT) as req:
                farmings = json.load(req)
            for farming in farmings:
                skh_lp_amounts[farming["skh"]] += int(farming["amount_staked"])

        for skh, amount in skh_lp_amounts.items():
            milk_amount = int(total_lp_milk * amount / lp_total_amount)
            skh_amounts[skh] += milk_amount
        for pkh, amount in pkh_lp_amounts.items():
            milk_amount = int(total_lp_milk * amount / lp_total_amount)
            pkh_amounts[pkh] += milk_amount
    return skh_amounts, pkh_amounts


def get_eligible_did_voters():
    skh_did_amounts, _ = get_token_holders(ATALA_DID_NFT_POLICY_ID, None, True)
    return set([skh for skh, amount in skh_did_amounts.items() if amount > 0])


#@shared_task
def do_holder_snapshot(election_id):
    token_amounts = defaultdict(int)
    queries = [get_milk_holders(), get_milk_stakers(), get_milk_lps()]
    eligible_did_voters = get_eligible_did_voters()

    for skh_ams in [q[0] for q in queries]:
        for skh, amount in skh_ams.items():
            if skh in eligible_did_voters:
                token_amounts[skh] += amount

    election = Election.objects.get(id=election_id)

    # handle delegations here
    delegates_to = get_delegations(eligible_did_voters)
    for d, r in delegates_to.items():
        # skip if is delegated to by someone (no recursive delegations)
        if d in delegates_to.values():
            continue
        if d in token_amounts:
            amount_delegated = token_amounts[d]
            token_amounts[d] = 0
        else:
            amount_delegated = 0
        if r in token_amounts:
            token_amounts[r] += amount_delegated
        else:
            token_amounts[r] = amount_delegated
        item = VoterSnapshot(
            election=election,
            skh=d,
            token_quantity=CUSTOM_WEIGHT_FUNCTION(amount_delegated),
            delegated_to=r
        )
        item.save()

    for skh, amount in token_amounts.items():
        if amount <= 0:
            continue
        item = VoterSnapshot(
            election=election,
            skh=skh,
            token_quantity=CUSTOM_WEIGHT_FUNCTION(amount)
        )
        item.save()