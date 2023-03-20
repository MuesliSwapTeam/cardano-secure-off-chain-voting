import {
  MUESLISWAP_AMM_CONTRACT,
  MUESLISWAP_BATCHER_ADDRESS,
  MUESLISWAP_BATCHER_V2_CONTRACT,
  MUESLISWAP_PLUTUS_V2_BATCHER_ADDRESS,
} from 'cardano/constants'
import Loader from 'cardano/helpers/loader.js'
import { assetsToValue, fromAscii, fromHex, toHex } from 'cardano/helpers/utils.js'
import { createOutput, finalizeTX, initTx } from 'cardano/liquidity/base'

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

  const redeemer = Loader.Cardano.Redeemer.new(
    Loader.Cardano.RedeemerTag.new_spend(),
    Loader.Cardano.BigNum.from_str(index),
    redeemerData,
    // increased from 650000 to 700000 as people couldnt cancel

    Loader.Cardano.ExUnits.new(Loader.Cardano.BigNum.from_str('680000'), Loader.Cardano.BigNum.from_str('250000000')),
  )

  return redeemer
}

const LIQUIDITY_DATUM = (
  minLiquidityTokens,
  scooperFee,
  pubKeyHash,
  stakingCredentialHash,
  deposit,
  poolType,
  poolTokenName,
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

  // 1. address object consisting of pubkeyhash and scriptcredential
  propertyList.add(addressObject)

  // 2. Trader Information (pubKeyHash + stakingCredentialHash)
  propertyList.add(addressObject)

  // 3. maybe Hash of Receiver Datum
  const unknownConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('1'), Loader.Cardano.PlutusList.new()),
  )

  propertyList.add(unknownConstr)

  // 4. want token info
  const depositList = Loader.Cardano.PlutusList.new()

  const depositAmount = Loader.Cardano.PlutusData.new_integer(
    Loader.Cardano.BigInt.from_str(minLiquidityTokens.toString()),
  )

  depositList.add(depositAmount)

  const depositConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), depositList),
  )

  propertyList.add(depositConstr)

  // order of 4 and 5 not clear
  // 5. Laminar Batcher Fee
  const scooperFeeData = Loader.Cardano.PlutusData.new_integer(Loader.Cardano.BigInt.from_str(scooperFee.toString()))
  propertyList.add(scooperFeeData)

  // 6. Deposit
  const depositData = Loader.Cardano.PlutusData.new_integer(Loader.Cardano.BigInt.from_str(deposit.toString()))
  propertyList.add(depositData)

  // 7. poolID - we only introduced this for poolType v2 scripts
  if (poolType === 'v2') {
    propertyList.add(Loader.Cardano.PlutusData.new_bytes(fromHex(poolTokenName)))
  }

  const datumString = Loader.Cardano.PlutusData.new_bytes(fromHex(fromAscii('MuesliSwap_AMM')))

  propertyList.add(datumString)

  const datum = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), propertyList),
  )

  return datum
}

function getDatum(minLiquidityTokens, scooperFee, pubKeyHash, stakingCredentialHash, deposit, poolType, poolTokenName) {
  var datum = LIQUIDITY_DATUM(
    minLiquidityTokens,
    scooperFee,
    pubKeyHash,
    stakingCredentialHash,
    deposit,
    poolType,
    poolTokenName,
  )

  var hash = Loader.Cardano.hash_plutus_data(datum)

  return { datum, hash }
}

export async function depositLiquidity(
  wallet,
  tokenAPolicyID,
  tokenAName,
  amountA,
  tokenBPolicyId,
  tokenBName,
  amountB,
  minimumLiquidityTokensRequired,
  poolType,
  poolId,
) {
  const { txBuilder, datums, metadata, outputs } = await initTx()
  const walletAddress = Loader.Cardano.BaseAddress.from_address(
    Loader.Cardano.Address.from_bytes(fromHex((await wallet.getUsedAddresses())[0])),
  )
  const poolTokenName = poolId.split('.')[1]

  var oCreatorPubKeyHash = walletAddress.payment_cred().to_keyhash().to_bytes()
  var oCreatorStakingKeyHash = walletAddress.stake_cred().to_keyhash().to_bytes()

  const scooperFee = 2000000
  const deposit = 2000000

  var { datum, hash } = getDatum(
    minimumLiquidityTokensRequired,
    scooperFee,
    toHex(oCreatorPubKeyHash),
    toHex(oCreatorStakingKeyHash),
    deposit,
    poolType,
    poolTokenName,
  )

  datums.add(datum)

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  metadata[TRANSACTION_MESSAGE] = { msg: ['MuesliSwap AMM: Deposit Liquidity'] }

  var lovelaceAmountAttached = deposit + scooperFee
  var assets = []

  if (tokenAPolicyID != '') {
    assets.push({
      unit: tokenAPolicyID + tokenAName,
      quantity: amountA.toString(),
    })
  } else {
    // account for small offset
    lovelaceAmountAttached += amountA + 1000
  }

  if (tokenBPolicyId != '') {
    assets.push({
      unit: tokenBPolicyId + tokenBName,
      quantity: amountB.toString(),
    })
  } else {
    // account for small offset and add 1000 lovelace
    lovelaceAmountAttached += amountB + 1000
  }

  assets.push({
    unit: 'lovelace',
    quantity: lovelaceAmountAttached.toString(),
  })

  var value = assetsToValue(assets)
  var output = undefined
  if (poolType === 'v1') {
    output = createOutput(MUESLISWAP_BATCHER_ADDRESS(), value, datum, hash)
  } else if (poolType === 'v2') {
    output = createOutput(MUESLISWAP_PLUTUS_V2_BATCHER_ADDRESS(), value, datum, hash)
  }
  outputs.add(output)

  const txHash = await finalizeTX(wallet, txBuilder, walletAddress, utxos, outputs, datums, metadata, null, null)

  return { txHash: txHash.toString() }
}

async function constructUTXO(txHash, txId, assets, address) {
  const utxo = Loader.Cardano.TransactionUnspentOutput.new(
    Loader.Cardano.TransactionInput.new(
      Loader.Cardano.TransactionHash.from_bytes(fromHex(txHash.toString())),
      Number(txId.toString()),
    ),
    Loader.Cardano.TransactionOutput.new(address, assetsToValue(assets)),
  )

  return utxo
}

export async function cancelLiquidityDepositRequest(
  wallet,
  walletAddress,
  txHash,
  txId,
  tokenAPolicyId,
  tokenAName,
  tokenAAmount,
  tokenBPolicyId,
  tokenBName,
  tokenBAmount,
  lovelaceAttached,
  minLiquidityTokens,
  batcherFee,
  deposit,
  poolType,
  poolId,
) {
  const { txBuilder, datums, metadata, outputs } = await initTx()

  const walletBaseAddress = Loader.Cardano.BaseAddress.from_address(Loader.Cardano.Address.from_bech32(walletAddress))

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  let poolTokenName = undefined
  if (poolType === 'v2') {
    if (poolId.includes('.')) {
      poolTokenName = poolId.split('.')[1]
    } else {
      poolTokenName = poolId
    }
  }

  var oCreatorPubKeyHash = walletBaseAddress.payment_cred().to_keyhash().to_bytes()
  var oCreatorStakingKeyHash = walletBaseAddress.stake_cred().to_keyhash().to_bytes()

  const { datum, hash } = getDatum(
    minLiquidityTokens,
    batcherFee,
    oCreatorPubKeyHash,
    oCreatorStakingKeyHash,
    deposit,
    poolType,
    poolTokenName,
  )
  datums.add(datum)

  var assets = []
  if (tokenAPolicyId === '') {
    assets = [
      {
        unit: 'lovelace',
        quantity: (Number(tokenAAmount) + Number(lovelaceAttached)).toString(),
      },
      {
        unit: tokenBPolicyId + tokenBName,
        quantity: tokenBAmount.toString(),
      },
    ]
  } else if (tokenBPolicyId === '') {
    assets = [
      {
        unit: tokenAPolicyId + tokenAName,
        quantity: tokenAAmount.toString(),
      },
      {
        unit: 'lovelace',
        quantity: (Number(tokenBAmount) + Number(lovelaceAttached)).toString(),
      },
    ]
  } else {
    assets = [
      {
        unit: tokenAPolicyId + tokenAName,
        quantity: tokenAAmount.toString(),
      },
      {
        unit: tokenBPolicyId + tokenBName,
        quantity: tokenBAmount.toString(),
      },
      {
        unit: 'lovelace',
        quantity: lovelaceAttached.toString(),
      },
    ]
  }

  var depositUtxo = undefined
  if (poolType === 'v1') {
    depositUtxo = await constructUTXO(txHash, txId, assets, MUESLISWAP_BATCHER_ADDRESS())
  } else {
    depositUtxo = await constructUTXO(txHash, txId, assets, MUESLISWAP_PLUTUS_V2_BATCHER_ADDRESS())
  }

  // add required signers
  txBuilder.add_required_signer(
    Loader.Cardano.Ed25519KeyHash.from_bytes(walletBaseAddress.payment_cred().to_keyhash().to_bytes()),
  )

  const redeemer = CANCEL('0')
  var plutusWitness = undefined
  if (poolType === 'v1') {
    plutusWitness = Loader.Cardano.PlutusWitness.new(MUESLISWAP_AMM_CONTRACT(), datum, redeemer)
  } else {
    plutusWitness = Loader.Cardano.PlutusWitness.new(MUESLISWAP_BATCHER_V2_CONTRACT(), datum, redeemer)
  }
  txBuilder.add_plutus_script_input(plutusWitness, depositUtxo.input(), depositUtxo.output().amount())

  const newTxHash = await finalizeTX(
    wallet,
    txBuilder,
    walletBaseAddress,
    utxos,
    outputs,
    datums,
    null,
    depositUtxo,
    CANCEL,
    poolType === 'v1' ? MUESLISWAP_AMM_CONTRACT() : MUESLISWAP_BATCHER_V2_CONTRACT(),
    false,
  )

  return newTxHash.toString()
}

export async function getAllLiquidityTokens(wallet, policyId) {
  var tokenList = []

  if (!wallet) return tokenList

  const valueHex = await wallet.getBalance()
  const value = Loader.Cardano.Value.from_bytes(fromHex(valueHex))

  if (!value.multiasset()) {
    return tokenList
  }

  const scriptHashPolicyId = Loader.Cardano.ScriptHash.from_bytes(fromHex(policyId))
  const policy = value.multiasset().get(scriptHashPolicyId)

  if (policy) {
    var keys = policy.keys()

    for (var i = 0; i < keys.len(); i++) {
      const assetName = toHex(keys.get(i).name())
      const assetQuantity = policy.get(keys.get(i)).to_str()

      tokenList.push({ assetName: assetName, assetQuantity: assetQuantity })
    }
  }

  return tokenList
}
