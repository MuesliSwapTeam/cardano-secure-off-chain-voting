# Cardano Secure Off-Chain Voting
A platform (we interface, backend services, and election library) for performing secure off-chain voting on the Cardano blockchain.

This is the github repository for our Project Catalyst Fund 9 project: https://cardano.ideascale.com/c/idea/422741.

For the version hosted by MuesliSwap as their governance platform, visit [vote.muesliswap.com](https://vote.muesliswap.com).

Note that this system is implemented on top of [Helios](https://www.heliosvoting.org). For details on the underlying cryptographic methods, we refer to their [documentation](https://www.heliosvoting.org/docs).

## Setup

Make sure `gunicorn` is installed on your system. Adjust the path in `voting/server/start_server.sh` to match the location on your system, then execute `voting/server/start_server.sh`.

Note that accounts corresponding to addresses listed in `admin_whitelist.json` will be able to create and manage elections, all other wallets take the role of normal voters.
