import { createOutput, finalizeTX, initTx } from 'cardano/aggregator/base'
import { ORDERBOOK_REVENUE_ADDRESS, SUNDAESWAP_ADDRESS, SUNDAESWAP_PLUTUS_V1_CONTRACT } from 'cardano/constants'
import Loader from 'cardano/helpers/loader.js'
import { assetsToValue, fromHex, toHex } from 'cardano/helpers/utils.js'

// Cardano specific loader and utils
// IDS for the Metadata that needs to be attached in the transaction

const TRANSACTION_MESSAGE = 674

export const cardanoInit = async () => {
  await Loader.load()
}

const CANCEL = (index) => {
  const redeemerData = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('1'), Loader.Cardano.PlutusList.new()),
  )

  //TODO: Compute computational costs! Moreover, understand what Index means and as documntation
  /**
   * The first entry defines what type of script we have (spending),
   * then we provide the actual redeemer and how many computational units he needs
   * structure of ExUnits (memory consumption, cpu steps)
   */

  const redeemer = Loader.Cardano.Redeemer.new(
    Loader.Cardano.RedeemerTag.new_spend(),
    Loader.Cardano.BigNum.from_str(index),
    redeemerData,
    // increased from 650000 to 700000 as people couldnt cancel

    Loader.Cardano.ExUnits.new(Loader.Cardano.BigNum.from_str('380000'), Loader.Cardano.BigNum.from_str('150000000')),
  )

  return redeemer
}

const SUNDAE_DATUM = (
  poolID,
  tokenSellAmount,
  tokenBuyAmount,
  scooperFee,
  pubKeyHash,
  stakingCredentialHash,
  swapDirection,
) => {
  // propertyList - list holding the different things required
  // 1. poolID - identifier of SundaeSwap LP pool (bytes object)
  // 2. Trader Information (pubKeyHash + stakingCredentialHash)
  // 3. SundaeSwap Scooper Fee
  // 4. Token amounts constructor holding x, token 1 amount , token 2 amount -> what is x ?

  const propertyList = Loader.Cardano.PlutusList.new()

  // 1.  poolID - identifier of SundaeSwap LP pool
  propertyList.add(Loader.Cardano.PlutusData.new_bytes(fromHex(poolID)))

  // 2. Trader Information
  const traderList = Loader.Cardano.PlutusList.new()

  const innerTraderList = Loader.Cardano.PlutusList.new()

  // pubKeyHash + stakingCredentialHash
  const innerTradePart1List = Loader.Cardano.PlutusList.new()

  const pubKeyHashList = Loader.Cardano.PlutusList.new()

  pubKeyHashList.add(Loader.Cardano.PlutusData.new_bytes(fromHex(pubKeyHash)))

  const pubKeyHashConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), pubKeyHashList),
  )

  innerTradePart1List.add(pubKeyHashConstr)

  const innerInnerStakingCredentialHashList = Loader.Cardano.PlutusList.new()
  innerInnerStakingCredentialHashList.add(Loader.Cardano.PlutusData.new_bytes(fromHex(stakingCredentialHash)))

  const innerInnerStakingCredentialHashConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), innerInnerStakingCredentialHashList),
  )

  const innerStakingCredentialHashList = Loader.Cardano.PlutusList.new()

  innerStakingCredentialHashList.add(innerInnerStakingCredentialHashConstr)

  const innerStakingCredentialHashConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), innerStakingCredentialHashList),
  )

  const stakingCredentialHashList = Loader.Cardano.PlutusList.new()

  stakingCredentialHashList.add(innerStakingCredentialHashConstr)

  const stakingKeyHashConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), stakingCredentialHashList),
  )

  innerTradePart1List.add(stakingKeyHashConstr)

  const innerTradePart1 = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), innerTradePart1List),
  )
  innerTraderList.add(innerTradePart1)

  const innerTradePart2 = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('1'), Loader.Cardano.PlutusList.new()),
  )

  innerTraderList.add(innerTradePart2)

  const innerTraderConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), innerTraderList),
  )

  traderList.add(innerTraderConstr)

  const part2 = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('1'), Loader.Cardano.PlutusList.new()),
  )

  traderList.add(part2)

  const traderConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), traderList),
  )

  propertyList.add(traderConstr)

  // 3. SundaeSwap Scooper Fee
  const scooperFeeData = Loader.Cardano.PlutusData.new_integer(Loader.Cardano.BigInt.from_str(scooperFee.toString()))

  propertyList.add(scooperFeeData)

  // 4. Token amounts constructor holding x, token 1 amount , token 2 amount -> what is x ? always just so an empty list?
  const tokenAmountsList = Loader.Cardano.PlutusList.new()

  // Assumption We have pool ADA/PAVIA -> constructor gives us trading direction (swapDirection)
  const unknownConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(
      Loader.Cardano.BigNum.from_str(swapDirection.toString()),
      Loader.Cardano.PlutusList.new(),
    ),
  )
  tokenAmountsList.add(unknownConstr)

  // sellAmount - Integer
  const sellAmountInt = Loader.Cardano.PlutusData.new_integer(
    Loader.Cardano.BigInt.from_str(tokenSellAmount.toString()),
  )
  tokenAmountsList.add(sellAmountInt)

  // buyAmount - Constr. Object
  const buyAmountList = Loader.Cardano.PlutusList.new()
  buyAmountList.add(Loader.Cardano.PlutusData.new_integer(Loader.Cardano.BigInt.from_str(tokenBuyAmount.toString())))
  const buyAmountConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), buyAmountList),
  )

  tokenAmountsList.add(buyAmountConstr)

  const tokenAmounts = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), tokenAmountsList),
  )

  propertyList.add(tokenAmounts)

  const datum = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), propertyList),
  )

  return datum
}

function getDatum(
  poolId,
  tokenSellAmount,
  tokenBuyAmount,
  scooperFee,
  pubKeyHash,
  stakingCredentialHash,
  swapDirection,
) {
  var datum = SUNDAE_DATUM(
    poolId,
    tokenSellAmount,
    tokenBuyAmount,
    scooperFee,
    pubKeyHash,
    stakingCredentialHash,
    swapDirection,
  )
  var hash = Loader.Cardano.hash_plutus_data(datum)

  return { datum, hash }
}

const setCollateral = (txBuilder, utxos) => {
  const inputs = Loader.Cardano.TransactionInputs.new()
  inputs.add(utxos[0].input())

  txBuilder.set_collateral(inputs)
  return txBuilder
}

function constructUtxo(txHash, txId, assetsAttached) {
  const assets = []

  for (var i = 0; i < assetsAttached.length; i++) {
    var asset = assetsAttached[i]
    var utxoAsset = {}
    var tokenPolicyId = asset['address']['policyId']
    var tokenName = asset['address']['name']
    var unitName = undefined
    var quantity = undefined

    if (tokenPolicyId == '') {
      tokenPolicyId = ''
      tokenName = ''
      unitName = 'lovelace'
    } else {
      let assetName = tokenPolicyId + tokenName
      unitName = assetName
    }

    quantity = asset['amount'].toString()

    utxoAsset = {
      unit: unitName,
      quantity: quantity,
    }

    assets.push(utxoAsset)
  }

  const utxo = Loader.Cardano.TransactionUnspentOutput.new(
    Loader.Cardano.TransactionInput.new(
      Loader.Cardano.TransactionHash.from_bytes(fromHex(txHash)),
      Number(txId.toString()),
    ),
    Loader.Cardano.TransactionOutput.new(SUNDAESWAP_ADDRESS(), assetsToValue(assets)),
  )

  return utxo
}

export async function cancelSwap(
  wallet,
  address,
  utxo,
  valueAttached,
  tokenSellAmount,
  tokenBuyAmount,
  poolId,
  swapDirection,
  scooperFee,
) {
  let utxoHash = utxo.split('#')[0]
  let utxoId = utxo.split('#')[1]

  const { txBuilder, datums, metadata, outputs } = await initTx()
  const walletAddress = Loader.Cardano.BaseAddress.from_address(Loader.Cardano.Address.from_bech32(address))

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  const oCreatorPubKeyHash = walletAddress.payment_cred().to_keyhash().to_bytes()
  const oCreatorStakingKeyHash = walletAddress.stake_cred().to_keyhash().to_bytes()

  const sundaeUTXO = constructUtxo(utxoHash, utxoId, valueAttached)

  const { datum, bytesHash } = getDatum(
    poolId,
    tokenSellAmount,
    tokenBuyAmount,
    scooperFee,
    toHex(oCreatorPubKeyHash),
    toHex(oCreatorStakingKeyHash),
    swapDirection,
  )

  datums.add(datum)

  // add required signers
  txBuilder.add_required_signer(
    Loader.Cardano.Ed25519KeyHash.from_bytes(walletAddress.payment_cred().to_keyhash().to_bytes()),
  )

  const redeemer = CANCEL('0')
  const plutusWitness = Loader.Cardano.PlutusWitness.new(SUNDAESWAP_PLUTUS_V1_CONTRACT(), datum, redeemer)
  txBuilder.add_plutus_script_input(plutusWitness, sundaeUTXO.input(), sundaeUTXO.output().amount())

  // TODO: find better metadata message
  metadata[TRANSACTION_MESSAGE] = { msg: ['SSP: Cancel Swap Request via MuesliSwap'] }

  const txHash = await finalizeTX(
    wallet,
    txBuilder,
    walletAddress,
    utxos,
    outputs,
    datums,
    metadata,
    sundaeUTXO,
    CANCEL,
  )

  return { txHash: txHash.toString() }
}

export async function placeOrder(
  wallet,
  amountA,
  policyIdA,
  nameA,
  amountB,
  policyIdB,
  nameB,
  ident,
  direction,
  adaDAppFee,
  adaFrontendFee,
) {
  const { txBuilder, datums, metadata, outputs } = await initTx()

  const walletAddress = Loader.Cardano.BaseAddress.from_address(
    Loader.Cardano.Address.from_bytes(fromHex((await wallet.getUsedAddresses())[0])),
  )

  var oCreatorPubKeyHash = walletAddress.payment_cred().to_keyhash().to_bytes()
  var oCreatorStakingKeyHash = walletAddress.stake_cred().to_keyhash().to_bytes()

  var haveAssetPolicy = policyIdA
  var haveAssetName = nameA

  const tokenSellAmount = parseInt(amountA)
  const tokenBuyAmount = parseInt(amountB)

  var poolIdent = ident
  var swapDirection = direction

  const scooperFee = 2500000

  var { datum, hash } = getDatum(
    poolIdent,
    tokenSellAmount,
    tokenBuyAmount,
    scooperFee,
    toHex(oCreatorPubKeyHash),
    toHex(oCreatorStakingKeyHash),
    swapDirection,
  )

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

  datums.add(datum)

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  metadata[TRANSACTION_MESSAGE] = { msg: ['SSP: Swap Request via MuesliSwap'] }

  var deposit = 2000000
  // ToDO: use tokenSellAmount only if it is ADA else attach in Assets
  var lovelaceAmountAttached = deposit + scooperFee
  var assets = []

  if (haveAssetPolicy != '') {
    assets.push({
      unit: haveAssetPolicy + haveAssetName,
      quantity: tokenSellAmount.toString(),
    })
  } else {
    lovelaceAmountAttached += tokenSellAmount
  }

  assets.push({
    unit: 'lovelace',
    quantity: lovelaceAmountAttached.toString(),
  })

  var output = createOutput(SUNDAESWAP_ADDRESS(), assetsToValue(assets), datum, hash)
  outputs.add(output)

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

  const txHash = await finalizeTX(wallet, txBuilder, walletAddress, utxos, outputs, datums, metadata, null, null)

  return { txHash: txHash.toString() }
}
