"""
Cardano Wallet Authentication

"""

import httplib2
from typing import Union
from cose.keys import CoseKey
from cose.keys.keyparam import OKPKpX
from cose.messages import CoseMessage
from django.conf import settings
from django.core.mail import send_mail

from helios_auth import utils

import hashlib

# some parameters to indicate that status updating is not possible
STATUS_UPDATES = False

# display tweaks
LOGIN_MESSAGE = "Log in with my Cardano Wallet"

def get_auth_url(request, redirect_url):
  return "/"

def get_user_info_after_auth(request):
  addr_str = request.session['pkh'] + '.' + request.session['skh']
  user_id = hashlib.sha256(addr_str.encode('utf-8')).hexdigest()
  user_name = user_id[:10]
  user_email = 'mock@mail.com'
  return {
    'type' : 'wallet',
    'user_id': user_id,
    'pkh': request.session['pkh'],
    'skh': request.session['skh'],
    'name': user_name,
    'info': {'email': user_email},
    'token':{}
  }
    
def do_logout(user):
  """
  logout of Google
  """
  return None
  
def update_status(token, message):
  """
  simple update
  """
  pass

def send_message(user_id, name, user_info, subject, body):
  """
  send email to google users. user_id is the email for google.
  """
  send_mail(subject, body, settings.SERVER_EMAIL, ["%s <%s>" % (name, user_id)], fail_silently=False)
  
def check_constraint(constraint, user_info):
  """
  for eligibility
  """
  pass

#
# Election Creation
#

def can_create_election(user_id, user_info):
  return True



# adjusted from pycardano implementation
def verify_signature(signed_message: Union[str, dict]) -> dict:
  attach_cose_key = isinstance(signed_message, dict)
  key = signed_message.get("key")
  signed_message = signed_message.get("signature")

  # Add back the "D2" header byte and decode
  assert isinstance(signed_message, str), "signed_message must be a hex string"
  decoded_message = CoseMessage.decode(bytes.fromhex("d2" + signed_message))

  assert isinstance(key, str), "key must be a hex string"
  cose_key = CoseKey.decode(bytes.fromhex(key))
  verification_key = cose_key[OKPKpX]

  # attach the key to the decoded message
  decoded_message.key = cose_key
  signature_verified = decoded_message.verify_signature()
  message = decoded_message.payload.decode("utf-8")
  return message if signature_verified else None