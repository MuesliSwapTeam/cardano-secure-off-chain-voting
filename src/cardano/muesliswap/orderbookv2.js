import {
  ORDERBOOK_PLUTUS_V2_ADDRESS,
  ORDERBOOK_PLUTUS_V2_CONTRACT,
  ORDERBOOK_PLUTUS_V2_OPTIMIZED_ADDRESS,
  ORDERBOOK_PLUTUS_V2_OPTIMIZED_CONTRACT,
  ORDERBOOK_REVENUE_ADDRESS,
} from 'cardano/constants'
import Loader from 'cardano/helpers/loader.js'
import { assetsToValue, fromHex, toHex } from 'cardano/helpers/utils.js'
import { constructUTXO, createOutput, finalizeTX, initTx } from 'cardano/muesliswap/base'
import { getCancelPlutusV1Redeemer, getOrderbookV2Datum } from 'cardano/muesliswap/shared'

// Cardano specific loader and utils
// IDS for the Metadata that needs to be attached in the transaction
const TRANSACTION_MESSAGE = 674
const ORDER_CREATOR_ADDRESS = 1000
const BUY_CURRENCY_SYMBOL_LABEL = 1002
const BUY_TOKEN_NAME_LABEL = 1003
const ORDER_AMOUNT_LABEL = 1004
// this includes matchmaker fee and minumum to transfer back
const ADA_TRANSFER_LABEL = 1005
// label indicating if partial match is allowed either 0 or 1
const PARTIAL_MATCH_ALLOWED = 1007
const SELL_CURRENY_SYMBOL_LABEL = 1008
const SELL_TOKEN_NAME_LABEL = 1009

export const cardanoInit = async () => {
  await Loader.load()
}

export async function cancelOrder(
  wallet,
  utxoHash,
  utxoId,
  oSellCurrency,
  oSellToken,
  oSellValue,
  oBuyCurrency,
  oBuyToken,
  oBuyAmount,
  lvlAttached,
  receivedAmount,
  address,
  feeField,
  optimizedContract,
) {
  const { txBuilder, datums, metadata, outputs } = await initTx(false)

  oSellValue = Math.round(Number(oSellValue))
  lvlAttached = Math.round(Number(lvlAttached))
  oBuyAmount = Math.round(Number(oBuyAmount))
  receivedAmount = Math.round(Number(receivedAmount))

  const walletAddress = Loader.Cardano.BaseAddress.from_address(Loader.Cardano.Address.from_bytes(fromHex(address)))

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  var oCreatorPubKeyHash = walletAddress.payment_cred().to_keyhash().to_bytes()
  var oCreatorStakingKeyHash = walletAddress.stake_cred().to_keyhash().to_bytes()

  var contractAddress = undefined
  var contractScript = undefined

  if (optimizedContract) {
    contractAddress = ORDERBOOK_PLUTUS_V2_OPTIMIZED_ADDRESS()
    contractScript = ORDERBOOK_PLUTUS_V2_OPTIMIZED_CONTRACT()
  } else {
    contractAddress = ORDERBOOK_PLUTUS_V2_ADDRESS()
    contractScript = ORDERBOOK_PLUTUS_V2_CONTRACT()
  }

  const offerUtxo = constructUTXO(
    utxoHash,
    utxoId,
    oSellCurrency,
    oSellToken,
    oSellValue,
    lvlAttached,
    receivedAmount,
    oBuyCurrency,
    oBuyToken,
    contractAddress,
  )

  // if we use ada then convert to lovelaces
  if (oBuyCurrency == '') {
    oBuyAmount = Math.round(oBuyAmount - (lvlAttached - 1.7e6))
  }

  const datum = getOrderbookV2Datum(
    toHex(oCreatorPubKeyHash),
    toHex(oCreatorStakingKeyHash),
    oBuyCurrency,
    oBuyToken,
    oSellCurrency,
    oSellToken,
    oBuyAmount,
    Math.round(Number(feeField.toString())),
  )

  // add required signers
  txBuilder.add_required_signer(
    Loader.Cardano.Ed25519KeyHash.from_bytes(walletAddress.payment_cred().to_keyhash().to_bytes()),
  )

  const redeemer = getCancelPlutusV1Redeemer('0')

  const plutusWitness = Loader.Cardano.PlutusWitness.new(contractScript, datum, redeemer)

  txBuilder.add_plutus_script_input(plutusWitness, offerUtxo.input(), offerUtxo.output().amount())

  // TODO: reintroduce frontend fee
  const txHash = await finalizeTX(
    wallet,
    txBuilder,
    walletAddress,
    utxos,
    outputs,
    datums,
    null,
    offerUtxo,
    getCancelPlutusV1Redeemer,
  )

  return { txHash: txHash.toString() }
}

// Please note when buying ADA provide price in lovelaces
export async function placeOrder(
  wallet,
  oSellCurrency,
  oSellToken,
  oSellAmount,
  oBuyCurrency,
  oBuyToken,
  oBuyAmount,
  adaTransfer,
  adaFrontendFee,
  adaMMFee,
  adaDAppFee,
) {
  const { txBuilder, datums, metadata, outputs } = await initTx(true)

  const walletAddress = Loader.Cardano.BaseAddress.from_address(
    Loader.Cardano.Address.from_bytes(fromHex((await wallet.getUsedAddresses())[0])),
  )
  var oCreatorPubKeyHash = walletAddress.payment_cred().to_keyhash().to_bytes()
  var oCreatorStakingKeyHash = walletAddress.stake_cred().to_keyhash().to_bytes()

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  const newMetadata = {
    [TRANSACTION_MESSAGE]: {},
    [ORDER_CREATOR_ADDRESS]: {},
    [BUY_CURRENCY_SYMBOL_LABEL]: {},
    [BUY_TOKEN_NAME_LABEL]: {},
    [ORDER_AMOUNT_LABEL]: {},
    [ADA_TRANSFER_LABEL]: {},
    [PARTIAL_MATCH_ALLOWED]: {},
    [SELL_CURRENY_SYMBOL_LABEL]: {},
    [SELL_TOKEN_NAME_LABEL]: {},
  }

  if (oBuyCurrency === '' && oBuyToken === '') {
    oBuyAmount = oBuyAmount - Math.round(adaMMFee * 1e6)
  }

  const datum = getOrderbookV2Datum(
    toHex(oCreatorPubKeyHash),
    toHex(oCreatorStakingKeyHash),
    oBuyCurrency,
    oBuyToken,
    oSellCurrency,
    oSellToken,
    oBuyAmount,
    Math.round(adaTransfer * 1e6),
  )

  datums.add(datum)

  const hash = Loader.Cardano.hash_plutus_data(datum)

  newMetadata[TRANSACTION_MESSAGE] = { msg: ['MuesliSwap Place Order'] }
  newMetadata[ORDER_CREATOR_ADDRESS] = '0x' + toHex(walletAddress.to_address().to_bytes())
  newMetadata[BUY_CURRENCY_SYMBOL_LABEL] = oBuyCurrency
  newMetadata[BUY_TOKEN_NAME_LABEL] = oBuyToken
  newMetadata[ORDER_AMOUNT_LABEL] = oBuyAmount
  newMetadata[ADA_TRANSFER_LABEL] = Math.round(adaTransfer * 1e6)
  newMetadata[PARTIAL_MATCH_ALLOWED] = 1
  newMetadata[SELL_CURRENY_SYMBOL_LABEL] = oSellCurrency
  newMetadata[SELL_TOKEN_NAME_LABEL] = oSellToken

  var unitName = oSellCurrency + oSellToken

  var lovelaceTransfer = Math.round(adaTransfer * 1e6)

  var assets = []
  var totalAdaToSend = lovelaceTransfer

  if (oSellCurrency === '') {
    totalAdaToSend += parseFloat(oSellAmount)
  } else {
    assets.push({
      unit: unitName,
      quantity: oSellAmount.toString(),
    })
  }

  assets.push({
    unit: 'lovelace',
    quantity: totalAdaToSend.toString(),
  })

  var output = createOutput(ORDERBOOK_PLUTUS_V2_OPTIMIZED_ADDRESS(), assetsToValue(assets), datum, hash)
  outputs.add(output)

  if (adaFrontendFee >= 1) {
    var lovelaceFrontendFee = Math.round(adaFrontendFee * 1e6)

    var frontendOutput = createOutput(
      ORDERBOOK_REVENUE_ADDRESS(),
      assetsToValue([
        {
          unit: 'lovelace',
          quantity: lovelaceFrontendFee.toString(),
        },
      ]),
      null,
      null,
    )
    outputs.add(frontendOutput)
  }

  if (wallet.isDAppConnector() && wallet.dAppFeeAddress() && adaDAppFee >= 1) {
    var lovelaceDAppFee = Math.round(adaDAppFee * 1e6)

    var dAppOutput = createOutput(
      Loader.Cardano.Address.from_bech32(wallet.dAppFeeAddress()),
      assetsToValue([
        {
          unit: 'lovelace',
          quantity: lovelaceDAppFee.toString(),
        },
      ]),
      null,
      null,
    )
    outputs.add(dAppOutput)
  }

  const txHash = await finalizeTX(
    wallet,
    txBuilder,
    walletAddress,
    utxos,
    outputs,
    datums,
    newMetadata,
    null,
    null,
    true,
  )

  return { txHash: txHash.toString() }
}
