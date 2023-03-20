import Loader from 'cardano/helpers/loader.js'
import { fromHex, assetsToValue } from 'cardano/helpers/utils.js'
import { ORDERS_BACKEND_V2_URL } from 'config/backendConfig'

export function constructFeeUTXO(utxoHash, utxoId, feeAmountLovelace) {
  // temporary hard coded values
  const utxo = Loader.Cardano.TransactionUnspentOutput.new(
    Loader.Cardano.TransactionInput.new(Loader.Cardano.TransactionHash.from_bytes(fromHex(utxoHash)), utxoId),
    Loader.Cardano.TransactionOutput.new(
      ORDERBOOK_REVENUE_ADDRESS(),
      assetsToValue([
        {
          unit: 'lovelace',
          quantity: feeAmountLovelace.toString(),
        },
      ]),
    ),
  )

  return utxo
}

export async function getFeeInfo(txHash) {
  // Get all utxos from enterprise address and send them to basic address
  var utxosUrl = `${ORDERS_BACKEND_V2_URL()}/tx/ffee-utxo?txhash=${txHash}`
  var responseUtxos = await fetch(utxosUrl)

  if (responseUtxos.status === 200) {
    const responseJson = await responseUtxos.json()
    let feeIndex = responseJson['tx_ix']
    let feeLovelace = responseJson['lovelace_attached']

    return { feeIndex, feeLovelace }
  }

  let feeIndex = 0
  let feeLovelace = 0

  return { feeIndex, feeLovelace }
}
