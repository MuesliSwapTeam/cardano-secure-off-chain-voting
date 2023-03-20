import { LIQUIDITY_BOOTRSTAPPING_ADDRESS } from 'cardano/constants'
import Loader from 'cardano/helpers/loader.js'
import { assetsToValue, fromHex } from 'cardano/helpers/utils.js'
import { createOutput, finalizeTX, initTx } from 'cardano/muesliswap/base'

// Cardano specific loader and utils
// IDS for the Metadata that needs to be attached in the transaction

const TRANSACTION_MESSAGE = 674

export const cardanoInit = async () => {
  await Loader.load()
}

export async function transferFunds(wallet, adaAmount) {
  const { txBuilder, datums, metadata, outputs } = await initTx()
  const walletAddress = Loader.Cardano.BaseAddress.from_address(
    Loader.Cardano.Address.from_bytes(fromHex((await wallet.getUsedAddresses())[0])),
  )

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  metadata[TRANSACTION_MESSAGE] = { msg: ['MuesliSwap: MILK Liquidity Bootstrapping Event'] }

  var assets = []

  assets.push({
    unit: 'lovelace',
    quantity: Math.round(Number(adaAmount) * 1e6 + 2e6).toString(),
  })

  var output = undefined
  output = createOutput(LIQUIDITY_BOOTRSTAPPING_ADDRESS(), assetsToValue(assets), undefined, undefined)
  outputs.add(output)

  const txHash = await finalizeTX(wallet, txBuilder, walletAddress, utxos, outputs, datums, metadata, null, null)

  return { txHash: txHash.toString() }
}

export async function transferRewardToken(wallet, rewardAmount) {
  const { txBuilder, datums, metadata, outputs } = await initTx()
  const walletAddress = Loader.Cardano.BaseAddress.from_address(
    Loader.Cardano.Address.from_bytes(fromHex((await wallet.getUsedAddresses())[0])),
  )

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  metadata[TRANSACTION_MESSAGE] = { msg: ['MuesliSwap: Transform MLBE to MILK/ADA LP'] }

  var assets = []

  assets.push({
    unit: 'lovelace',
    quantity: (2.5e6).toString(),
  })

  assets.push({
    unit: '5d0c8a159e94bb2c1a8c4df51e889e1dec8006c5d34e05b8d9843f5f4d494c4b2d4c4245',
    quantity: Math.round(rewardAmount * 1e6).toString(),
  })

  var output = undefined
  output = createOutput(LIQUIDITY_BOOTRSTAPPING_ADDRESS(), assetsToValue(assets), undefined, undefined)
  outputs.add(output)

  const txHash = await finalizeTX(wallet, txBuilder, walletAddress, utxos, outputs, datums, metadata, null, null)

  return { txHash: txHash.toString() }
}
