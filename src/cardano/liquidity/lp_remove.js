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
  wantTokenA,
  wantTokenB,
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
  const wantTokenList = Loader.Cardano.PlutusList.new()

  const wantTokenAObj = Loader.Cardano.PlutusData.new_integer(Loader.Cardano.BigInt.from_str(wantTokenA.toString()))
  const wantTokenBObj = Loader.Cardano.PlutusData.new_integer(Loader.Cardano.BigInt.from_str(wantTokenB.toString()))

  wantTokenList.add(wantTokenAObj)
  wantTokenList.add(wantTokenBObj)

  const depositConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('1'), wantTokenList),
  )

  propertyList.add(depositConstr)

  // order of 4 and 5 not clear
  // 5. Laminar Batcher Fee
  const scooperFeeData = Loader.Cardano.PlutusData.new_integer(Loader.Cardano.BigInt.from_str(scooperFee.toString()))
  propertyList.add(scooperFeeData)

  // 6. Deposit
  const depositData = Loader.Cardano.PlutusData.new_integer(Loader.Cardano.BigInt.from_str(deposit.toString()))
  propertyList.add(depositData)

  // 7. add pool id for plutus v2 only
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

function getDatum(
  wantTokenA,
  wantTokenB,
  scooperFee,
  pubKeyHash,
  stakingCredentialHash,
  deposit,
  poolType,
  poolTokenName,
) {
  var datum = LIQUIDITY_DATUM(
    wantTokenA,
    wantTokenB,
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

export async function removeLiquidity(
  wallet,
  liquidityTokenPolicyID,
  liquidityTokenName,
  liquidityTokenAmount,
  minTokenA,
  minTokenB,
  poolType,
  poolId,
) {
  const { txBuilder, datums, metadata, outputs } = await initTx()
  const walletAddress = Loader.Cardano.BaseAddress.from_address(
    Loader.Cardano.Address.from_bytes(fromHex((await wallet.getUsedAddresses())[0])),
  )

  var oCreatorPubKeyHash = walletAddress.payment_cred().to_keyhash().to_bytes()
  var oCreatorStakingKeyHash = walletAddress.stake_cred().to_keyhash().to_bytes()
  const poolTokenName = poolId.split('.')[1]

  const scooperFee = 2000000
  const deposit = 2000000

  var { datum, hash } = getDatum(
    minTokenA,
    minTokenB,
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

  metadata[TRANSACTION_MESSAGE] = { msg: ['MuesliSwap AMM: Remove Liquidity'] }

  var lovelaceAmountAttached = deposit + scooperFee
  var assets = []

  assets.push({
    unit: liquidityTokenPolicyID + liquidityTokenName,
    quantity: liquidityTokenAmount.toString(),
  })

  assets.push({
    unit: 'lovelace',
    quantity: lovelaceAmountAttached.toString(),
  })

  var output = undefined
  if (poolType === 'v1') {
    output = createOutput(MUESLISWAP_BATCHER_ADDRESS(), assetsToValue(assets), datum, hash)
  } else {
    output = createOutput(MUESLISWAP_PLUTUS_V2_BATCHER_ADDRESS(), assetsToValue(assets), datum, hash)
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

export async function cancelLiquidityRemoveRequest(
  wallet,
  walletAddress,
  txHash,
  txId,
  liquidityTokenPolicyId,
  liquidityTokenName,
  liquidityTokenAmount,
  minTokenA,
  minTokenB,
  batcherFee,
  deposit,
  poolType,
  poolId,
) {
  const { txBuilder, datums, metadata, outputs } = await initTx()
  let poolTokenName = poolId.split('.')[1]

  if (poolTokenName == undefined) {
    poolTokenName = poolId
  }

  const walletBaseAddress = Loader.Cardano.BaseAddress.from_address(Loader.Cardano.Address.from_bech32(walletAddress))

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  var oCreatorPubKeyHash = walletBaseAddress.payment_cred().to_keyhash().to_bytes()
  var oCreatorStakingKeyHash = walletBaseAddress.stake_cred().to_keyhash().to_bytes()

  const { datum, hash } = getDatum(
    minTokenA,
    minTokenB,
    batcherFee,
    oCreatorPubKeyHash,
    oCreatorStakingKeyHash,
    deposit,
    poolType,
    poolTokenName,
  )
  datums.add(datum)

  var assets = [
    {
      unit: 'lovelace',
      quantity: (parseInt(batcherFee) + parseInt(deposit)).toString(),
    },
    {
      unit: liquidityTokenPolicyId + liquidityTokenName,
      quantity: liquidityTokenAmount.toString(),
    },
  ]

  var removeUtxo = undefined
  if (poolType === 'v1') {
    removeUtxo = await constructUTXO(txHash, txId, assets, MUESLISWAP_BATCHER_ADDRESS())
  } else {
    removeUtxo = await constructUTXO(txHash, txId, assets, MUESLISWAP_PLUTUS_V2_BATCHER_ADDRESS())
  }
  // add required signers
  txBuilder.add_required_signer(
    Loader.Cardano.Ed25519KeyHash.from_bytes(walletBaseAddress.payment_cred().to_keyhash().to_bytes()),
  )

  const redeemer = CANCEL('0')
  const plutusWitness = Loader.Cardano.PlutusWitness.new(
    poolType === 'v1' ? MUESLISWAP_AMM_CONTRACT() : MUESLISWAP_BATCHER_V2_CONTRACT(),
    datum,
    redeemer,
  )
  txBuilder.add_plutus_script_input(plutusWitness, removeUtxo.input(), removeUtxo.output().amount())

  const newTxHash = await finalizeTX(
    wallet,
    txBuilder,
    walletBaseAddress,
    utxos,
    outputs,
    datums,
    null,
    removeUtxo,
    CANCEL,
  )

  return newTxHash
}
