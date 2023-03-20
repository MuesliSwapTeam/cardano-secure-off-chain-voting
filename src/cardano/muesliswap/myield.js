import {
  MVOUCHER_TRANSFORM_ADDRESS,
  MYIELD_TRANSFORM_ADDRESS,
  STAKING_FEE_ADDRESS,
  STAKING_MYIELD_ADDRESS,
  STAKING_MYIELD_CONTRACT,
} from 'cardano/constants'
import Loader from 'cardano/helpers/loader.js'
import { assetsToValue, fromHex, toHex } from 'cardano/helpers/utils.js'
import { createOutput, finalizeTX, initTx } from 'cardano/muesliswap/base'

// Cardano specific loader and utils
// IDS for the Metadata that needs to be attached in the transaction

const TRANSACTION_MESSAGE = 674

const STAKING_POOL_ID_LABEL = 2000
const STAKING_CREATOR_LABEL = 2001
const STAKING_CREATOR_STAKE_KEY_LABEL = 2002

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

  var output = createOutput(STAKING_MYIELD_ADDRESS(), assetsToValue(assets), datum, hash)
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
  lovelaceAttached,
  lovelaceStakingFee,
  address,
  rewardAmount,
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
    STAKING_MYIELD_ADDRESS(),
  )

  var { datum, hash } = getDatum(toHex(oCreator))

  datums.add(datum)

  // add required signers
  txBuilder.add_required_signer(
    Loader.Cardano.Ed25519KeyHash.from_bytes(walletAddress.payment_cred().to_keyhash().to_bytes()),
  )

  const redeemer = CANCEL('0')
  const plutusWitness = Loader.Cardano.PlutusWitness.new(STAKING_MYIELD_CONTRACT(), datum, redeemer)
  txBuilder.add_plutus_script_input(plutusWitness, stakeUTXO.input(), stakeUTXO.output().amount())

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

  if (rewardAmount >= 1) {
    outputs.add(output)
  }

  const txHash = await finalizeTX(wallet, txBuilder, walletAddress, utxos, outputs, datums, null, stakeUTXO, CANCEL)

  return { txHash: txHash.toString() }
}

export async function transformMyieldToMvoucher(
  wallet,
  utxoHash,
  utxoId,
  stakedTokenPolicyID,
  stakedTokenName,
  stakedTokenAmount,
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
    STAKING_MYIELD_ADDRESS(),
  )

  var { datum, hash } = getDatum(toHex(oCreator))

  datums.add(datum)

  // add required signers
  txBuilder.add_required_signer(
    Loader.Cardano.Ed25519KeyHash.from_bytes(walletAddress.payment_cred().to_keyhash().to_bytes()),
  )

  const redeemer = CANCEL('0')
  const plutusWitness = Loader.Cardano.PlutusWitness.new(STAKING_MYIELD_CONTRACT(), datum, redeemer)
  txBuilder.add_plutus_script_input(plutusWitness, stakeUTXO.input(), stakeUTXO.output().amount())

  var unitName = stakedTokenPolicyID + stakedTokenName

  var output = createOutput(
    MYIELD_TRANSFORM_ADDRESS(),
    assetsToValue([
      {
        unit: 'lovelace',
        quantity: lovelaceStakingFee.toString(),
      },
      {
        unit: unitName,
        quantity: Math.round(stakedTokenAmount).toString(),
      },
    ]),
    null,
    null,
  )

  outputs.add(output)

  const txHash = await finalizeTX(wallet, txBuilder, walletAddress, utxos, outputs, datums, null, stakeUTXO, CANCEL)

  return { txHash: txHash.toString() }
}

export async function transformMVoucherToMilk(
  wallet,
  mvoucherPolicyId,
  mvoucherName,
  mvoucherAmount,
  transformLovelaceBaseFee,
  transformLovelaceCost,
) {
  const { txBuilder, datums, metadata, outputs } = await initTx()
  const walletAddress = Loader.Cardano.BaseAddress.from_address(
    Loader.Cardano.Address.from_bytes(fromHex((await wallet.getUsedAddresses())[0])),
  )

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  metadata[TRANSACTION_MESSAGE] = { msg: ['MuesliSwap: Transform MVoucher to MILK'] }

  var assets = []

  assets.push({
    unit: 'lovelace',
    quantity: Math.round(Number(transformLovelaceBaseFee) + Number(transformLovelaceCost)).toString(),
  })

  assets.push({
    unit: mvoucherPolicyId + mvoucherName,
    quantity: Math.round(mvoucherAmount).toString(),
  })

  var output = undefined
  output = createOutput(MVOUCHER_TRANSFORM_ADDRESS(), assetsToValue(assets), undefined, undefined)
  outputs.add(output)

  const txHash = await finalizeTX(wallet, txBuilder, walletAddress, utxos, outputs, datums, metadata, null, null)

  return { txHash: txHash.toString() }
}
