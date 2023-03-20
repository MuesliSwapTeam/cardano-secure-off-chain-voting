import CoinSelection from 'cardano/helpers/coinSelection.js'
import { getProtocolParameters, getTXBuilderConfig } from 'cardano/helpers/config'
import Loader from 'cardano/helpers/loader.js'
import { assetsToValue, fromHex, toHex } from 'cardano/helpers/utils.js'
import { WalletError, WalletErrorTypes } from 'hooks/useOnWalletInteraction'

const TRANSACTION_MESSAGE = 674

export const initTx = async (addDatumWitness) => {
  await Loader.load()

  const protocolParameters = await getProtocolParameters()
  const txBuilderConfig = await getTXBuilderConfig(protocolParameters, addDatumWitness)

  const txBuilder = Loader.Cardano.TransactionBuilder.new(txBuilderConfig)

  const datums = Loader.Cardano.PlutusList.new()
  const metadata = {
    [TRANSACTION_MESSAGE]: {},
  }
  const outputs = Loader.Cardano.TransactionOutputs.new()

  return { txBuilder, datums, metadata, outputs }
}

export const createOutput = (address, value, datum, datumHash) => {
  const v = value

  const output = Loader.Cardano.TransactionOutput.new(address, v)

  if (datum) {
    output.set_data_hash(datumHash)
  }

  //TODO: replace with correct parameter value
  const dataCost = Loader.Cardano.DataCost.new_coins_per_byte(Loader.Cardano.BigNum.from_str('4310'))
  const minAda = Loader.Cardano.min_ada_for_output(output, dataCost)

  if (minAda.compare(v.coin()) == 1) v.set_coin(minAda)

  const outputFinal = Loader.Cardano.TransactionOutput.new(address, v)

  if (datum) {
    outputFinal.set_data_hash(datumHash)
  }

  return outputFinal
}

export const createOutputInlineDatum = (address, value, datum) => {
  const v = value

  const output = Loader.Cardano.TransactionOutput.new(address, v)

  if (datum) {
    output.set_plutus_data(datum)
  }

  //TODO: replace with correct parameter value
  const dataCost = Loader.Cardano.DataCost.new_coins_per_byte(Loader.Cardano.BigNum.from_str('4310'))
  const minAda = Loader.Cardano.min_ada_for_output(output, dataCost)

  if (minAda.compare(v.coin()) == 1) v.set_coin(minAda)

  const outputFinal = Loader.Cardano.TransactionOutput.new(address, v)

  if (datum) {
    outputFinal.set_plutus_data(datum)
  }

  return outputFinal
}

export async function finalizeTX(
  wallet,
  txBuilder,
  changeAddress,
  utxos,
  outputs,
  datums,
  metadata,
  scriptUtxo,
  action,
  embedDatum,
) {
  // add outputs
  for (let i = 0; i < outputs.len(); i++) {
    txBuilder.add_output(outputs.get(i))
  }

  let aux_data
  // add metadata
  if (metadata) {
    aux_data = Loader.Cardano.AuxiliaryData.new()
    const generalMetadata = Loader.Cardano.GeneralTransactionMetadata.new()
    Object.keys(metadata).forEach((label) => {
      generalMetadata.insert(
        Loader.Cardano.BigNum.from_str(label),
        Loader.Cardano.encode_json_str_to_metadatum(JSON.stringify(metadata[label]), 1),
      )
    })
    aux_data.set_metadata(generalMetadata)
    txBuilder.set_auxiliary_data(aux_data)
  }

  const protocolParameters = await getProtocolParameters()

  CoinSelection.setProtocolParameters(
    protocolParameters.minUtxo,
    protocolParameters.linearFee.minFeeA,
    protocolParameters.linearFee.minFeeB,
    protocolParameters.maxTxSize.toString(),
    protocolParameters.coinsPerUtxoByte.toString(),
  )

  let { input, change } = CoinSelection.randomImprove(utxos, outputs, 14, scriptUtxo ? [scriptUtxo] : [])

  if (scriptUtxo) {
    input.forEach((utxo) => {
      if (
        utxo.input().transaction_id().to_hex() !== scriptUtxo.input().transaction_id().to_hex() ||
        utxo.input().index() !== scriptUtxo.input().index()
      ) {
        txBuilder.add_input(utxo.output().address(), utxo.input(), utxo.output().amount())
      }
    })
  } else {
    input.forEach((utxo) => {
      txBuilder.add_input(utxo.output().address(), utxo.input(), utxo.output().amount())
    })
  }

  if (scriptUtxo) {
    const costmdls = Loader.Cardano.TxBuilderConstants.plutus_vasil_cost_models()
    txBuilder.calc_script_data_hash(costmdls)

    var walletCollateral = await wallet.getCollateral()
    if (!walletCollateral) throw new WalletError(WalletErrorTypes.NO_COLLATERAL)

    var collateralUtxos = walletCollateral.map((utxo) =>
      Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
    )
    if (!collateralUtxos?.length || !collateralUtxos[0]) throw new WalletError(WalletErrorTypes.INVALID_COLLATERAL)

    var collateralUtxo = collateralUtxos[0]

    const txInputsBuilder = Loader.Cardano.TxInputsBuilder.new()
    txInputsBuilder.add_input(
      collateralUtxo.output().address(),
      collateralUtxo.input(),
      collateralUtxo.output().amount(),
    )

    txBuilder.set_collateral(txInputsBuilder)
  }

  if (embedDatum && datums && !action) {
    const costmdls = Loader.Cardano.Costmdls.new()
    const redeemers = Loader.Cardano.Redeemers.new()
    const datumsTmp = Loader.Cardano.PlutusList.from_bytes(datums.to_bytes())
    const scriptDataHash = Loader.Cardano.hash_script_data(redeemers, costmdls, datumsTmp)
    txBuilder.set_script_data_hash(scriptDataHash)
  }

  txBuilder.add_change_if_needed(changeAddress.to_address())

  const buildTransaction = txBuilder.build_tx()

  const witnessSetTmp = buildTransaction.witness_set()

  if (embedDatum && datums && !action) {
    witnessSetTmp.set_plutus_data(datums)
  }

  const tmpTransaction = Loader.Cardano.Transaction.new(
    buildTransaction.body(),
    witnessSetTmp,
    buildTransaction.auxiliary_data(),
  )

  const unsignedTxCBOR = toHex(tmpTransaction.to_bytes())

  let txVkeyWitnesses = await wallet.signTx(unsignedTxCBOR, true)
  txVkeyWitnesses = Loader.Cardano.TransactionWitnessSet.from_bytes(fromHex(txVkeyWitnesses))
  var vKeyWitnesses = txVkeyWitnesses.vkeys()

  const witnessSet = tmpTransaction.witness_set()
  witnessSet.set_vkeys(vKeyWitnesses)

  const signedTx = Loader.Cardano.Transaction.new(tmpTransaction.body(), witnessSet, tmpTransaction.auxiliary_data())

  const txCborHex = toHex(signedTx.to_bytes())

  const txHash = await wallet.submitTx(txCborHex)
  return txHash
}

export function constructUTXO(
  utxoHash,
  utxoId,
  sellTokenPolicyId,
  sellTokenName,
  sellTokenAmount,
  lvlAttached,
  receivedAmount,
  buyTokenPolicyId,
  buyTokenName,
  address,
) {
  // use different value if we buy ADA
  var lovelaceTotal = lvlAttached

  if (buyTokenPolicyId === '') {
    var lovelaceTotal = 1.7e6
  }

  let assetsObj = []

  if (buyTokenPolicyId !== '' && receivedAmount > 0) {
    var utxoAsset = {
      unit: buyTokenPolicyId + buyTokenName,
      quantity: receivedAmount.toString(),
    }
    assetsObj.push(utxoAsset)
  } else {
    // receivedAmount need to sutract 0.95 ada in mm fee -> todo: find better way to do that
    lovelaceTotal += receivedAmount
  }

  if (sellTokenPolicyId !== '') {
    assetsObj.push({
      unit: sellTokenPolicyId + sellTokenName,
      quantity: sellTokenAmount.toString(),
    })
  } else {
    lovelaceTotal += sellTokenAmount
  }

  assetsObj.push({
    unit: 'lovelace',
    quantity: lovelaceTotal.toString(),
  })

  const transactionInput = Loader.Cardano.TransactionInput.new(
    Loader.Cardano.TransactionHash.from_bytes(fromHex(utxoHash)),
    Number(utxoId.toString()),
  )
  const transactionOutput = Loader.Cardano.TransactionOutput.new(address, assetsToValue(assetsObj))

  const utxo = Loader.Cardano.TransactionUnspentOutput.new(transactionInput, transactionOutput)

  return utxo
}
