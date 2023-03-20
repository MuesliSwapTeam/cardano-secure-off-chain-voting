import Loader from 'cardano/helpers/loader.js'
import { fromHex } from 'cardano/helpers/utils.js'
import { FACTORY_MINT_SCRIPT, POOL_NFT_MINT_SCRIPT, LP_TOKEN_MINT_SCRIPT } from 'cardano/constants'
import { initTx, createOutput, finalizeTX } from 'cardano/liquidity/base'

export const cardanoInit = async () => {
  await Loader.load()
}

export async function create_liquidity_pool(wallet, walletAddress) {
  const { txBuilder, datums, metadata, outputs } = await initTx()

  const walletBaseAddress = Loader.Cardano.BaseAddress.from_address(Loader.Cardano.Address.from_bech32(walletAddress))

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )
}
