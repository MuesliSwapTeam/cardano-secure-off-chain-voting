import {
  FARMING_ADDRESS,
  FARMING_CONTRACT,
  INDIGIO_FARMING_ADDRESS as INDIGO_FARMING_ADDRESS,
  INDIGO_FARMING_CONTRACT,
  STAKING_FEE_ADDRESS,
  INDIGO_STAKING_FEE_ADDRESS,
} from 'cardano/constants'
import Loader from 'cardano/helpers/loader.js'
import { assetsToValue, fromHex, toHex } from 'cardano/helpers/utils.js'
import { createOutput, createOutputInlineDatum, finalizeTX, initTx } from 'cardano/muesliswap/base'

// Cardano specific loader and utils
// IDS for the Metadata that needs to be attached in the transaction

const TRANSACTION_MESSAGE = 674

const STAKING_POOL_ID_LABEL = 2000
const STAKING_CREATOR_LABEL = 2001
const STAKING_CREATOR_STAKE_KEY_LABEL = 2002

// INDIGO specific information
const STAKING_TRANSACTION_HASH = 2003
const STAKING_TRANSACTION_INDEX = 2004

export const cardanoInit = async () => {
  await Loader.load()
}

// FOR NOW WE ONLY HAVE ONE DATUM TYPE WITH CONSTRUCTOR INTEGER 0
const STAKING_DATUM = (oCreator) => {
  const staking_datum = Loader.Cardano.PlutusData.new_bytes(fromHex(oCreator))
  return staking_datum
}

// Redeemer
const CANCEL = (index) => {
  const redeemerData = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), Loader.Cardano.PlutusList.new()),
  )

  const redeemer = Loader.Cardano.Redeemer.new(
    Loader.Cardano.RedeemerTag.new_spend(),
    Loader.Cardano.BigNum.from_str(index),
    redeemerData,
    // increased from 650000 to 700000 as people couldnt cancel

    Loader.Cardano.ExUnits.new(Loader.Cardano.BigNum.from_str('100000'), Loader.Cardano.BigNum.from_str('50000000')),
  )

  return redeemer
}

const INDIGO_STAKING_DATUM = (oCreator) => {
  const staking_data = Loader.Cardano.PlutusData.new_bytes(fromHex(oCreator))

  const staking_list = Loader.Cardano.PlutusList.new()
  staking_list.add(staking_data)

  const datum = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), staking_list),
  )
  return datum
}

const INDIGO_CANCEL = (index) => {
  const redeemerData = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), Loader.Cardano.PlutusList.new()),
  )

  const redeemer = Loader.Cardano.Redeemer.new(
    Loader.Cardano.RedeemerTag.new_spend(),
    Loader.Cardano.BigNum.from_str(index),
    redeemerData,
    Loader.Cardano.ExUnits.new(Loader.Cardano.BigNum.from_str('80450'), Loader.Cardano.BigNum.from_str('20000000')),
  )

  return redeemer
}

function getDatum(creator) {
  var datum = STAKING_DATUM(creator)
  var hash = Loader.Cardano.hash_plutus_data(datum)
  return { datum, hash }
}

function constructStakingUTXO(
  utxoHash,
  utxoId,
  stakedTokenPolicyID,
  stakedTokenName,
  stakedTokenAmount,
  lovelaceAttached,
  address,
  hungryCowPolicyID,
  hungryCowName,
) {
  var unitName = stakedTokenPolicyID + stakedTokenName

  var assets = [
    {
      unit: unitName,
      quantity: Math.round(stakedTokenAmount).toString(),
    },
    {
      unit: 'lovelace',
      quantity: lovelaceAttached.toString(),
    },
  ]

  if (hungryCowPolicyID != undefined && hungryCowName != undefined) {
    assets.push({
      unit: hungryCowPolicyID + hungryCowName,
      quantity: '1',
    })
  }

  const utxo = Loader.Cardano.TransactionUnspentOutput.new(
    Loader.Cardano.TransactionInput.new(
      Loader.Cardano.TransactionHash.from_bytes(fromHex(utxoHash)),
      Number(utxoId.toString()),
    ),
    Loader.Cardano.TransactionOutput.new(address, assetsToValue(assets)),
  )
  return utxo
}

export async function stakeToken(
  wallet,
  adaTransferAmount,
  stakedTokenPolicyID,
  stakedTokenName,
  stakedTokenAmount,
  hungryCowPolicyID,
  hungryCowName,
  poolID,
) {
  const { txBuilder, datums, metadata, outputs } = await initTx()
  const walletAddress = Loader.Cardano.BaseAddress.from_address(
    Loader.Cardano.Address.from_bytes(fromHex((await wallet.getUsedAddresses())[0])),
  )

  var oCreator = walletAddress.payment_cred().to_keyhash().to_bytes()
  var oCreatorStakeKey = walletAddress.stake_cred().to_keyhash().to_bytes()

  var { datum, hash } = getDatum(toHex(oCreator))

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )
  const newMetatdata = {
    [TRANSACTION_MESSAGE]: {},
    [STAKING_POOL_ID_LABEL]: {},
    [STAKING_CREATOR_LABEL]: {},
    [STAKING_CREATOR_STAKE_KEY_LABEL]: {},
  }

  newMetatdata[TRANSACTION_MESSAGE] = { msg: ['MuesliSwap Staking Order'] }
  newMetatdata[STAKING_POOL_ID_LABEL] = poolID
  newMetatdata[STAKING_CREATOR_LABEL] = toHex(oCreator)
  newMetatdata[STAKING_CREATOR_STAKE_KEY_LABEL] = toHex(oCreatorStakeKey)

  var unitName = stakedTokenPolicyID + stakedTokenName
  var lovelaceTransfer = Math.round(adaTransferAmount * 1e6)

  var assets = [
    {
      unit: unitName,
      quantity: stakedTokenAmount.toString(),
    },
    {
      unit: 'lovelace',
      quantity: lovelaceTransfer.toString(),
    },
  ]

  if (hungryCowPolicyID != undefined && hungryCowName != undefined) {
    var hungryCowUnitName = hungryCowPolicyID + hungryCowName

    assets.push({
      unit: hungryCowUnitName,
      quantity: '1',
    })
  }

  var output = createOutput(FARMING_ADDRESS(), assetsToValue(assets), datum, hash)
  outputs.add(output)

  const txHash = await finalizeTX(wallet, txBuilder, walletAddress, utxos, outputs, datums, newMetatdata, null, null)

  return { txHash: txHash.toString() }
}

export async function unstakeToken(
  wallet,
  utxoHash,
  utxoId,
  stakedTokenPolicyID,
  stakedTokenName,
  stakedTokenAmount,
  hungryCowPolicyID,
  hungryCowName,
  lovelaceAttached,
  lovelaceStakingFee,
  address,
) {
  const { txBuilder, datums, metadata, outputs } = await initTx()

  const walletAddress = Loader.Cardano.BaseAddress.from_address(Loader.Cardano.Address.from_bytes(fromHex(address)))

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  const oCreator = walletAddress.payment_cred().to_keyhash().to_bytes()

  lovelaceAttached = Math.round(lovelaceAttached)

  const stakeUTXO = constructStakingUTXO(
    utxoHash,
    utxoId,
    stakedTokenPolicyID,
    stakedTokenName,
    stakedTokenAmount,
    lovelaceAttached,
    FARMING_ADDRESS(),
    hungryCowPolicyID,
    hungryCowName,
  )

  var { datum, hash } = getDatum(toHex(oCreator))

  datums.add(datum)

  // add required signers
  txBuilder.add_required_signer(
    Loader.Cardano.Ed25519KeyHash.from_bytes(walletAddress.payment_cred().to_keyhash().to_bytes()),
  )

  const redeemer = CANCEL('0')
  const plutusWitness = Loader.Cardano.PlutusWitness.new(FARMING_CONTRACT(), datum, redeemer)
  txBuilder.add_plutus_script_input(plutusWitness, stakeUTXO.input(), stakeUTXO.output().amount())

  if (lovelaceStakingFee) {
    var output = createOutput(
      STAKING_FEE_ADDRESS(),
      assetsToValue([
        {
          unit: 'lovelace',
          quantity: lovelaceStakingFee.toString(),
        },
      ]),
      null,
      null,
    )

    outputs.add(output)
  }

  // TODO pjordan: Figure out why finalization fails
  const txHash = await finalizeTX(wallet, txBuilder, walletAddress, utxos, outputs, datums, null, stakeUTXO, CANCEL)

  return { txHash: txHash.toString() }
}

export async function harvestToken(
  wallet,
  utxoHash,
  utxoId,
  stakedTokenPolicyID,
  stakedTokenName,
  stakedTokenAmount,
  hungryCowPolicyID,
  hungryCowName,
  lovelaceAttached,
  lovelaceStakingFee,
  address,
  poolID,
) {
  const { txBuilder, datums, metadata, outputs } = await initTx()

  const walletAddress = Loader.Cardano.BaseAddress.from_address(Loader.Cardano.Address.from_bytes(fromHex(address)))

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  const oCreator = walletAddress.payment_cred().to_keyhash().to_bytes()
  const oCreatorStakeKey = walletAddress.stake_cred().to_keyhash().to_bytes()

  lovelaceAttached = Math.round(lovelaceAttached)

  const stakeUTXO = constructStakingUTXO(
    utxoHash,
    utxoId,
    stakedTokenPolicyID,
    stakedTokenName,
    stakedTokenAmount,
    lovelaceAttached,
    FARMING_ADDRESS(),
    hungryCowPolicyID,
    hungryCowName,
  )

  var { datum, hash } = getDatum(toHex(oCreator))

  datums.add(datum)

  // add required signers
  txBuilder.add_required_signer(
    Loader.Cardano.Ed25519KeyHash.from_bytes(walletAddress.payment_cred().to_keyhash().to_bytes()),
  )

  const redeemer = CANCEL('0')
  const plutusWitness = Loader.Cardano.PlutusWitness.new(FARMING_CONTRACT(), datum, redeemer)
  txBuilder.add_plutus_script_input(plutusWitness, stakeUTXO.input(), stakeUTXO.output().amount())

  if (lovelaceStakingFee) {
    var output = createOutput(
      STAKING_FEE_ADDRESS(),
      assetsToValue([
        {
          unit: 'lovelace',
          quantity: lovelaceStakingFee.toString(),
        },
      ]),
      null,
      null,
    )

    outputs.add(output)
  }

  const newMetatdata = {
    [TRANSACTION_MESSAGE]: {},
    [STAKING_POOL_ID_LABEL]: {},
    [STAKING_CREATOR_LABEL]: {},
    [STAKING_CREATOR_STAKE_KEY_LABEL]: {},
  }

  newMetatdata[TRANSACTION_MESSAGE] = { msg: ['MuesliSwap Staking Order'] }
  newMetatdata[STAKING_POOL_ID_LABEL] = poolID
  newMetatdata[STAKING_CREATOR_LABEL] = toHex(oCreator)
  newMetatdata[STAKING_CREATOR_STAKE_KEY_LABEL] = toHex(oCreatorStakeKey)

  var unitName = stakedTokenPolicyID + stakedTokenName

  var assets = [
    {
      unit: 'lovelace',
      quantity: lovelaceAttached.toString(),
    },
    {
      unit: unitName,
      quantity: Math.round(stakedTokenAmount).toString(),
    },
  ]

  if (hungryCowPolicyID != undefined && hungryCowName != undefined) {
    var hungryCowUnitName = hungryCowPolicyID + hungryCowName
    assets.push({
      unit: hungryCowUnitName,
      quantity: '1',
    })
  }

  var output = createOutput(FARMING_ADDRESS(), assetsToValue(assets), datum, hash)

  outputs.add(output)

  // TODO pjordan: Figure out why finalization fails
  const txHash = await finalizeTX(
    wallet,
    txBuilder,
    walletAddress,
    utxos,
    outputs,
    datums,
    newMetatdata,
    stakeUTXO,
    CANCEL,
  )

  return { txHash: txHash.toString() }
}

export async function harvestTokenIndigo(
  wallet,
  utxoHash,
  utxoId,
  stakedTokenPolicyID,
  stakedTokenName,
  stakedTokenAmount,
  hungryCowPolicyID,
  hungryCowName,
  lovelaceAttached,
  lovelaceStakingFee,
  address,
  poolID,
) {
  const { txBuilder, datums, metadata, outputs } = await initTx()

  const walletAddress = Loader.Cardano.BaseAddress.from_address(Loader.Cardano.Address.from_bytes(fromHex(address)))

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  const oCreator = walletAddress.payment_cred().to_keyhash().to_bytes()
  const oCreatorStakeKey = walletAddress.stake_cred().to_keyhash().to_bytes()

  lovelaceAttached = Math.round(lovelaceAttached)

  const stakeUTXO = constructStakingUTXO(
    utxoHash,
    utxoId,
    stakedTokenPolicyID,
    stakedTokenName,
    stakedTokenAmount,
    lovelaceAttached,
    INDIGO_FARMING_ADDRESS(),
    hungryCowPolicyID,
    hungryCowName,
  )

  var datum = INDIGO_STAKING_DATUM(toHex(oCreator))

  datums.add(datum)

  // add required signers
  txBuilder.add_required_signer(
    Loader.Cardano.Ed25519KeyHash.from_bytes(walletAddress.payment_cred().to_keyhash().to_bytes()),
  )

  const redeemer = INDIGO_CANCEL('0')
  // old approach - not using ref inputs
  // const plutusWitness = Loader.Cardano.PlutusWitness.new(INDIGO_FARMING_CONTRACT(), datum, redeemer)

  // TODO - use reference script for lower costs instead - not working yet
  /*
  
  const plutusRefTransactionInput = Loader.Cardano.TransactionInput.new(
    Loader.Cardano.TransactionHash.from_bytes(fromHex('b8928d51e58147f2bc753b23a6230f8584c27ffb9ad3b55d0eee25392455d71b')),
    Number('0'.toString()),
  )
  const plutusScriptHash = INDIGO_FARMING_CONTRACT().hash()
  const plutusScriptSource = Loader.Cardano.PlutusScriptSource.new_ref_input(plutusScriptHash, plutusRefTransactionInput)
  
  */

  const plutusScriptSource = Loader.Cardano.PlutusScriptSource.new(INDIGO_FARMING_CONTRACT())

  const datumRefTransactionInput = Loader.Cardano.TransactionInput.new(
    Loader.Cardano.TransactionHash.from_bytes(fromHex(utxoHash)),
    Number(utxoId.toString()),
  )

  const datumSource = Loader.Cardano.DatumSource.new_ref_input(datumRefTransactionInput)

  const plutusWitness = Loader.Cardano.PlutusWitness.new_with_ref(plutusScriptSource, datumSource, redeemer)

  txBuilder.add_plutus_script_input(plutusWitness, stakeUTXO.input(), stakeUTXO.output().amount())

  if (lovelaceStakingFee) {
    var output = createOutput(
      INDIGO_STAKING_FEE_ADDRESS(),
      assetsToValue([
        {
          unit: 'lovelace',
          quantity: lovelaceStakingFee.toString(),
        },
      ]),
      null,
      null,
    )

    outputs.add(output)
  }

  const newMetatdata = {
    [TRANSACTION_MESSAGE]: {},
    [STAKING_POOL_ID_LABEL]: {},
    [STAKING_TRANSACTION_HASH]: {},
    [STAKING_TRANSACTION_INDEX]: {},
  }

  newMetatdata[TRANSACTION_MESSAGE] = { msg: ['MuesliSwap Indigo Harvest Rewards'] }
  newMetatdata[STAKING_POOL_ID_LABEL] = poolID
  newMetatdata[STAKING_TRANSACTION_HASH] = utxoHash.toString()
  newMetatdata[STAKING_TRANSACTION_INDEX] = utxoId.toString()

  var unitName = stakedTokenPolicyID + stakedTokenName

  var assets = [
    {
      unit: 'lovelace',
      quantity: lovelaceAttached.toString(),
    },
    {
      unit: unitName,
      quantity: Math.round(stakedTokenAmount).toString(),
    },
  ]

  if (hungryCowPolicyID != undefined && hungryCowName != undefined) {
    var hungryCowUnitName = hungryCowPolicyID + hungryCowName
    assets.push({
      unit: hungryCowUnitName,
      quantity: '1',
    })
  }

  var output = createOutputInlineDatum(INDIGO_FARMING_ADDRESS(), assetsToValue(assets), datum)
  outputs.add(output)

  // TODO pjordan: Figure out why finalization fails
  const txHash = await finalizeTX(
    wallet,
    txBuilder,
    walletAddress,
    utxos,
    outputs,
    datums,
    newMetatdata,
    stakeUTXO,
    CANCEL,
  )

  return { txHash: txHash.toString() }
}

export async function harvestTokenIndigoInactive(wallet, utxoHash, utxoId, address, poolID, lovelaceStakingFee) {
  const { txBuilder, datums, metadata, outputs } = await initTx()

  const walletAddress = Loader.Cardano.BaseAddress.from_address(Loader.Cardano.Address.from_bytes(fromHex(address)))

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  const oCreator = walletAddress.payment_cred().to_keyhash().to_bytes()
  const oCreatorStakeKey = walletAddress.stake_cred().to_keyhash().to_bytes()

  if (lovelaceStakingFee) {
    var output = createOutput(
      INDIGO_STAKING_FEE_ADDRESS(),
      assetsToValue([
        {
          unit: 'lovelace',
          quantity: lovelaceStakingFee.toString(),
        },
      ]),
      null,
      null,
    )

    outputs.add(output)
  }

  const newMetatdata = {
    [TRANSACTION_MESSAGE]: {},
    [STAKING_POOL_ID_LABEL]: {},
    [STAKING_TRANSACTION_HASH]: {},
    [STAKING_TRANSACTION_INDEX]: {},
  }

  newMetatdata[TRANSACTION_MESSAGE] = { msg: ['MuesliSwap Indigo Claim Rewards'] }
  newMetatdata[STAKING_POOL_ID_LABEL] = poolID
  newMetatdata[STAKING_TRANSACTION_HASH] = utxoHash.toString()
  newMetatdata[STAKING_TRANSACTION_INDEX] = utxoId.toString()

  // TODO pjordan: Figure out why finalization fails
  const txHash = await finalizeTX(
    wallet,
    txBuilder,
    walletAddress,
    utxos,
    outputs,
    datums,
    newMetatdata,
    undefined,
    CANCEL,
  )

  return { txHash: txHash.toString() }
}
