import { createOutput, finalizeTX, initTx } from 'cardano/aggregator/base'
import { MINSWAP_ADDRESS_V2, MINSWAP_PLUTUS_V1_CONTRACT, ORDERBOOK_REVENUE_ADDRESS } from 'cardano/constants'
import Loader from 'cardano/helpers/loader.js'
import { assetsToValue, fromHex, toHex } from 'cardano/helpers/utils.js'

const TRANSACTION_MESSAGE = 674

// Cardano specific loader and utils
// IDS for the Metadata that needs to be attached in the transaction
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

    Loader.Cardano.ExUnits.new(Loader.Cardano.BigNum.from_str('380000'), Loader.Cardano.BigNum.from_str('150000000')),
  )

  return redeemer
}

const MINSWAP_DATUM = (
  tokenBuyPolicyId,
  tokenBuyName,
  tokenBuyAmount,
  scooperFee,
  pubKeyHash,
  stakingCredentialHash,
  deposit,
) => {
  // propertyList - list holding the different things required
  // 1. Trader Information (pubKeyHash + stakingCredentialHash) (sender according to contract)
  // 2. Trader Information (pubKeyHash + stakingCredentialHash) (receiver according to contract)
  // 3. Optional Receiver Datum Hash (what does this do? maybe ensure that output datum has this value, constructor 1 is prob None)
  // 4. Want token info / Swap step
  // 5. Laminar Batcher Fee
  // 6. Deposit

  const propertyList = Loader.Cardano.PlutusList.new()

  // 1. Trader Information (pubKeyHash + stakingCredentialHash)
  const addressObjList = Loader.Cardano.PlutusList.new()

  // represent PubKeyHash
  const pubKeyHashList = Loader.Cardano.PlutusList.new()

  pubKeyHashList.add(Loader.Cardano.PlutusData.new_bytes(fromHex(pubKeyHash)))

  const pubKeyHashConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), pubKeyHashList),
  )

  addressObjList.add(pubKeyHashConstr)

  const stakingCredentialHashList = Loader.Cardano.PlutusList.new()

  // represent StakingCredential
  if (stakingCredentialHash) {
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
  propertyList.add(addressObject)

  // 2. Trader Information (pubKeyHash + stakingCredentialHash)
  propertyList.add(addressObject)

  // 3. Unknown field
  const unknownConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('1'), Loader.Cardano.PlutusList.new()),
  )

  propertyList.add(unknownConstr)

  // 4. want token info
  const wantTokenList = Loader.Cardano.PlutusList.new()

  const wantTokenIdentifierList = Loader.Cardano.PlutusList.new()
  wantTokenIdentifierList.add(Loader.Cardano.PlutusData.new_bytes(fromHex(tokenBuyPolicyId)))
  wantTokenIdentifierList.add(Loader.Cardano.PlutusData.new_bytes(fromHex(tokenBuyName)))

  const wantTokenIdentifierConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), wantTokenIdentifierList),
  )

  wantTokenList.add(wantTokenIdentifierConstr)

  const buyAountData = Loader.Cardano.PlutusData.new_integer(Loader.Cardano.BigInt.from_str(tokenBuyAmount.toString()))

  wantTokenList.add(buyAountData)

  const wantTokenConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), wantTokenList),
  )

  propertyList.add(wantTokenConstr)

  // order of 4 and 5 not clear
  // 5. Laminar Batcher Fee
  const scooperFeeData = Loader.Cardano.PlutusData.new_integer(Loader.Cardano.BigInt.from_str(scooperFee.toString()))
  propertyList.add(scooperFeeData)

  // 6. Deposit
  const depositData = Loader.Cardano.PlutusData.new_integer(Loader.Cardano.BigInt.from_str(deposit.toString()))
  propertyList.add(depositData)

  const datum = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), propertyList),
  )

  return datum
}

function getDatum(
  tokenBuyPolicyId,
  tokenBuyName,
  tokenBuyAmount,
  scooperFee,
  pubKeyHash,
  stakingCredentialHash,
  deposit,
) {
  var datum = MINSWAP_DATUM(
    tokenBuyPolicyId,
    tokenBuyName,
    tokenBuyAmount,
    scooperFee,
    pubKeyHash,
    stakingCredentialHash,
    deposit,
  )

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
  tokenBuyPolicyId,
  tokenBuyName,
  tokenBuyAmount,
  batcherFee,
  minSwapVersion,
) {
  let deposit = 2000000 // todo: maybe not hardcode deposit?
  let utxoHash = utxo.split('#')[0]
  let utxoId = utxo.split('#')[1]

  const { txBuilder, datums, metadata, outputs } = await initTx()
  const walletAddress = Loader.Cardano.BaseAddress.from_address(Loader.Cardano.Address.from_bech32(address))

  const oCreatorPubKeyHash = walletAddress.payment_cred().to_keyhash().to_bytes()
  const oCreatorStakingKeyHash = walletAddress.stake_cred().to_keyhash().to_bytes()

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  metadata[TRANSACTION_MESSAGE] = { msg: ['MinSwap: Cancel Swap Request via MuesliSwap'] }

  const minSwapUtxo = constructUtxo(utxoHash, utxoId, valueAttached, MINSWAP_ADDRESS_V2())

  const { datum, bytesHash } = getDatum(
    tokenBuyPolicyId,
    tokenBuyName,
    tokenBuyAmount,
    batcherFee,
    toHex(oCreatorPubKeyHash),
    toHex(oCreatorStakingKeyHash),
    deposit,
  )
  datums.add(datum)

  // add required signers
  txBuilder.add_required_signer(
    Loader.Cardano.Ed25519KeyHash.from_bytes(walletAddress.payment_cred().to_keyhash().to_bytes()),
  )

  const redeemer = CANCEL('0')
  const plutusWitness = Loader.Cardano.PlutusWitness.new(MINSWAP_PLUTUS_V1_CONTRACT(), datum, redeemer)
  txBuilder.add_plutus_script_input(plutusWitness, minSwapUtxo.input(), minSwapUtxo.output().amount())

  const txHash = await finalizeTX(
    wallet,
    txBuilder,
    walletAddress,
    utxos,
    outputs,
    datums,
    metadata,
    minSwapUtxo,
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
  var haveAssetAmount = parseInt(amountA)

  var wantAssetPolicy = policyIdB
  var wantAssetName = nameB
  var wantAssetAmount = parseInt(amountB)

  const scooperFee = 2000000
  const deposit = 2000000

  var { datum, hash } = getDatum(
    wantAssetPolicy,
    wantAssetName,
    wantAssetAmount.toString(),
    scooperFee,
    toHex(oCreatorPubKeyHash),
    toHex(oCreatorStakingKeyHash),
    deposit,
  )

  datums.add(datum)

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  metadata[TRANSACTION_MESSAGE] = { msg: ['MinSwap: Swap Request via MuesliSwap'] }

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

  var output = createOutput(MINSWAP_ADDRESS_V2(), assetsToValue(assets), datum, hash)
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
