import blockfrost
import psycopg2
from cardano_python_utils.util import ShelleyAddress
from settings import BLOCKFROST_API_KEY


BF = blockfrost.BlockFrostApi(BLOCKFROST_API_KEY)

def query_token_holders():
    res = []
    i = 1
    while True:
        holders = BF.asset_addresses(asset='8a1cfae21368b8bebbbed9800fec304e95cce39a2a57dc35e2e3ebaa4d494c4b', page=i)
        if len(holders) == 0:
            break
        for h in holders:
            if h.address.startswith('Ae2') or h.address.startswith('DdzFF'):
                continue
            print(h.address)
            try:
                res.append((ShelleyAddress.from_bech32(h.address), int(h.quantity)))
            except NotImplementedError:
                continue
        i += 1

if __name__ == "__main__":
    holders = query_token_holders()