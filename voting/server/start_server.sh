#!/bin/bash
echo Starting Django MuesliSwap Governance App
cd /home/cardano/secure-offchain-voting/voting/server
source venv/bin/activate
pip install -r requirements.txt
gunicorn wsgi:application -w 4