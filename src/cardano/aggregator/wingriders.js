import { createOutput, finalizeTX, initTx } from 'cardano/aggregator/base'
import { ORDERBOOK_REVENUE_ADDRESS, WINGRIDERS_ADDRESS, WINGRIDERS_PLUTUS_V1_CONTRACT } from 'cardano/constants'
import Loader from 'cardano/helpers/loader.js'
import { assetsToValue, fromHex } from 'cardano/helpers/utils.js'

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

    Loader.Cardano.ExUnits.new(Loader.Cardano.BigNum.from_str('160000'), Loader.Cardano.BigNum.from_str('60000000')),
  )

  return redeemer
}

const WINGRIDERS_DATUM = (
  paymentKeyHash,
  stakingHash,
  tokenObjectList,
  buyTokenAmount,
  endTimeStamp,
  swapDirection,
) => {
  const propertyList = Loader.Cardano.PlutusList.new()
  // datum split into two parts each with a list

  const part1List = Loader.Cardano.PlutusList.new()

  // 1. Trader Information (pubKeyHash + stakingCredentialHash)
  const addressObjList = Loader.Cardano.PlutusList.new()

  // represent PubKeyHash
  const pubKeyHashList = Loader.Cardano.PlutusList.new()

  pubKeyHashList.add(Loader.Cardano.PlutusData.new_bytes(fromHex(paymentKeyHash)))

  const pubKeyHashConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), pubKeyHashList),
  )

  addressObjList.add(pubKeyHashConstr)

  const stakingCredentialHashList = Loader.Cardano.PlutusList.new()

  // represent StakingCredential
  if (stakingHash) {
    const innerInnerStakingCredentialHashList = Loader.Cardano.PlutusList.new()
    innerInnerStakingCredentialHashList.add(Loader.Cardano.PlutusData.new_bytes(fromHex(stakingHash)))

    const innerInnerStakingCredentialHashConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
      Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), innerInnerStakingCredentialHashList),
    )

    const innerStakingCredentialHashList = Loader.Cardano.PlutusList.new()

    innerStakingCredentialHashList.add(innerInnerStakingCredentialHashConstr)

    const innerStakingCredentialHashConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
      Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), innerStakingCredentialHashList),
    )

    stakingCredentialHashList.add(innerStakingCredentialHashConstr)
  }

  const stakingKeyHashConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), stakingCredentialHashList),
  )

  addressObjList.add(stakingKeyHashConstr)

  const addressObject = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(
      Loader.Cardano.BigNum.from_str('0'),
      addressObjList,
      //Loader.Cardano.PlutusList.new()
    ),
  )

  // address object consisting of pubkeyhash and scriptcredential
  part1List.add(addressObject)

  // pubKeyHash
  part1List.add(Loader.Cardano.PlutusData.new_bytes(fromHex(paymentKeyHash)))

  // unix Timestamp
  part1List.add(Loader.Cardano.PlutusData.new_integer(Loader.Cardano.BigInt.from_str(endTimeStamp.toString())))

  // Tokens to Switch
  const tokensList = Loader.Cardano.PlutusList.new()

  for (var i = 0; i < tokenObjectList.length; i++) {
    const tokenDetails = Loader.Cardano.PlutusList.new()

    tokenDetails.add(Loader.Cardano.PlutusData.new_bytes(fromHex(tokenObjectList[i]['policyId'])))
    tokenDetails.add(Loader.Cardano.PlutusData.new_bytes(fromHex(tokenObjectList[i]['tokenName'])))

    const tokenConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
      Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), tokenDetails),
    )

    tokensList.add(tokenConstr)
  }

  const tokenConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), tokensList),
  )

  part1List.add(tokenConstr)

  const part1Constr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), part1List),
  )

  propertyList.add(part1Constr)

  const part2List = Loader.Cardano.PlutusList.new()

  var unknownPart1Constr = undefined

  if (swapDirection === 1) {
    unknownPart1Constr = Loader.Cardano.PlutusData.new_constr_plutus_data(
      Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('1'), Loader.Cardano.PlutusList.new()),
    )
  } else {
    unknownPart1Constr = Loader.Cardano.PlutusData.new_constr_plutus_data(
      Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), Loader.Cardano.PlutusList.new()),
    )
  }

  part2List.add(unknownPart1Constr)

  const buyAmountInt = Loader.Cardano.PlutusData.new_integer(Loader.Cardano.BigInt.from_str(buyTokenAmount.toString()))
  part2List.add(buyAmountInt)

  const part2Constr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), part2List),
  )

  propertyList.add(part2Constr)

  const datum = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), propertyList),
  )

  return datum
}

function getDatum(paymentKeyHash, stakingHash, tokenObjectList, buyTokenAmount, endTimeStamp, direction) {
  var datum = WINGRIDERS_DATUM(paymentKeyHash, stakingHash, tokenObjectList, buyTokenAmount, endTimeStamp, direction)

  var hash = Loader.Cardano.hash_plutus_data(datum)

  return { datum, hash }
}

function constructUtxo(txHash, txId, assetsAttached, address) {
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
    Loader.Cardano.TransactionOutput.new(address, assetsToValue(assets)),
  )

  return utxo
}

export async function cancelSwap(
  wallet,
  address,
  utxo,
  valueAttached,
  tokenSellPolicyId,
  tokenSellName,
  tokenBuyPolicyId,
  tokenBuyName,
  tokenBuyAmount,
  batcherFee,
  endTimeStamp,
  swapDirection,
  fallback,
  datumContent,
) {
  let deposit = 2000000 // todo: maybe not hardcode deposit?
  let utxoHash = utxo.split('#')[0]
  let utxoId = utxo.split('#')[1]

  const { txBuilder, datums, metadata, outputs } = await initTx()
  const walletAddress = Loader.Cardano.BaseAddress.from_address(Loader.Cardano.Address.from_bech32(address))

  metadata[TRANSACTION_MESSAGE] = { msg: ['Wingriders: Cancel Swap Request via MuesliSwap'] }

  const oCreatorPubKeyHash = walletAddress.payment_cred().to_keyhash().to_bytes()
  const oCreatorStakingKeyHash = walletAddress.stake_cred().to_keyhash().to_bytes()

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  var contract_address = WINGRIDERS_ADDRESS()
  var contract = WINGRIDERS_PLUTUS_V1_CONTRACT()

  const wingridersUtxo = constructUtxo(utxoHash, utxoId, valueAttached, contract_address)

  var poolAPolicyId = undefined
  var poolAName = undefined

  var poolBPolicyId = undefined
  var poolBName = undefined
  var tokenObjectList = []

  if (fallback == 0) {
    if (swapDirection == 1) {
      poolAPolicyId = tokenBuyPolicyId
      poolAName = tokenBuyName

      poolBPolicyId = tokenSellPolicyId
      poolBName = tokenSellName

      tokenObjectList.push({ policyId: poolAPolicyId, tokenName: poolAName })
      tokenObjectList.push({ policyId: poolBPolicyId, tokenName: poolBName })
    } else {
      poolAPolicyId = tokenSellPolicyId
      poolAName = tokenSellName

      poolBPolicyId = tokenBuyPolicyId
      poolBName = tokenBuyName

      tokenObjectList.push({ policyId: poolAPolicyId, tokenName: poolAName })
      tokenObjectList.push({ policyId: poolBPolicyId, tokenName: poolBName })
    }
  } else {
    const datumObject = JSON.parse(datumContent)

    for (var i = 0; i < datumObject['json_value']['fields'][0]['fields'][3]['fields'].length; i++) {
      var policyId = datumObject['json_value']['fields'][0]['fields'][3]['fields'][i]['fields'][0]['bytes']
      var tokenName = datumObject['json_value']['fields'][0]['fields'][3]['fields'][i]['fields'][1]['bytes']

      tokenObjectList.push({ policyId: policyId, tokenName: tokenName })
    }
  }

  var { datum, hash } = getDatum(
    oCreatorPubKeyHash,
    oCreatorStakingKeyHash,
    tokenObjectList,
    tokenBuyAmount,
    endTimeStamp,
    swapDirection,
  )

  datums.add(datum)

  // add required signers
  txBuilder.add_required_signer(
    Loader.Cardano.Ed25519KeyHash.from_bytes(walletAddress.payment_cred().to_keyhash().to_bytes()),
  )

  const redeemer = CANCEL('0')
  const plutusWitness = Loader.Cardano.PlutusWitness.new(WINGRIDERS_PLUTUS_V1_CONTRACT(), datum, redeemer)
  txBuilder.add_plutus_script_input(plutusWitness, wingridersUtxo.input(), wingridersUtxo.output().amount())

  const txHash = await finalizeTX(
    wallet,
    txBuilder,
    walletAddress,
    utxos,
    outputs,
    datums,
    metadata,
    wingridersUtxo,
    CANCEL,
  )
}

export async function placeOrder(
  wallet,
  amountA,
  policyIdA,
  nameA,
  amountB,
  policyIdB,
  nameB,
  adaDAppFee,
  adaFrontendFee,
) {
  var scooperFee = 2e6
  var deposit = 2e6

  const { txBuilder, datums, metadata, outputs } = await initTx()
  const walletAddress = Loader.Cardano.BaseAddress.from_address(
    Loader.Cardano.Address.from_bytes(fromHex((await wallet.getUsedAddresses())[0])),
  )

  var oCreatorPubKeyHash = walletAddress.payment_cred().to_keyhash().to_bytes()
  var oCreatorStakingKeyHash = walletAddress.stake_cred().to_keyhash().to_bytes()

  var poolAPolicyId = undefined
  var poolAName = undefined

  var poolBPolicyId = undefined
  var poolBName = undefined
  var direction = undefined

  var tokenObjectList = []

  // ADA POOL NAME ALWAYS FIRST
  // TODO: how to handle wingriders case if non of the pool assets are ada
  if (policyIdB === '') {
    poolAPolicyId = policyIdB
    poolAName = nameB
    poolBPolicyId = policyIdA
    poolBName = nameA

    direction = 1
  } else {
    poolAPolicyId = policyIdA
    poolAName = nameA

    poolBPolicyId = policyIdB
    poolBName = nameB

    direction = 0
  }

  tokenObjectList.push({ policyId: poolAPolicyId, tokenName: poolAName })
  tokenObjectList.push({ policyId: poolBPolicyId, tokenName: poolBName })

  var haveAssetPolicy = policyIdA
  var haveAssetName = nameA
  var haveAssetAmount = parseInt(amountA)

  var wantAssetPolicy = policyIdB
  var wantAssetName = nameB
  var wantAssetAmount = Math.round(Number(amountB))

  // unix timestamp in milliseconds + adding 30 days in ms
  var endTimeStamp = Date.now() + 2.5e9

  // direction from wingriders -> pool is represented as fixed tokenA/tokenB
  // if we want to swap from tokenA -> tokenB direction is 0
  // if we want to swap from tokenB -> tokenA direction is 1

  var { datum, hash } = getDatum(
    oCreatorPubKeyHash,
    oCreatorStakingKeyHash,
    tokenObjectList,
    wantAssetAmount,
    endTimeStamp,
    direction,
  )

  datums.add(datum)

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  metadata[TRANSACTION_MESSAGE] = { msg: ['Wingriders: Swap Request via MuesliSwap'] }

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

  var lovelaceAmountAttached = deposit + scooperFee
  var assets = []

  if (haveAssetPolicy != '') {
    assets.push({
      unit: haveAssetPolicy + haveAssetName,
      quantity: haveAssetAmount.toString(),
    })
  } else {
    lovelaceAmountAttached += haveAssetAmount
  }

  assets.push({
    unit: 'lovelace',
    quantity: lovelaceAmountAttached.toString(),
  })

  var output = createOutput(WINGRIDERS_ADDRESS(), assetsToValue(assets), datum, hash)
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
