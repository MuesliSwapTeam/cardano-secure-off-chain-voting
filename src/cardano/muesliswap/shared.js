import Loader from 'cardano/helpers/loader.js'
import { fromHex } from 'cardano/helpers/utils.js'

// FOR NOW WE ONLY HAVE ONE DATUM TYPE WITH CONSTRUCTOR INTEGER 0
export const getOrderbookDatum = (
  oCreatorPubKeyHash,
  oCratorStakingKeyHash,
  oBuyCurrency,
  oBuyToken,
  oSellCurrency,
  oSellToken,
  oBuyAmount,
) => {
  // in a later step we might want to force full matches (instant swap for example)
  const oAllowPartial = true

  const fieldsInner = Loader.Cardano.PlutusList.new()

  // address Object pubKeyHash + stakingCredentialHash
  const addressObjList = Loader.Cardano.PlutusList.new()

  // represent PubKeyHash
  const pubKeyHashList = Loader.Cardano.PlutusList.new()

  pubKeyHashList.add(Loader.Cardano.PlutusData.new_bytes(fromHex(oCreatorPubKeyHash)))

  const pubKeyHashConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), pubKeyHashList),
  )

  addressObjList.add(pubKeyHashConstr)

  const stakingCredentialHashList = Loader.Cardano.PlutusList.new()

  // represent StakingCredential
  if (oCratorStakingKeyHash) {
    const innerInnerStakingCredentialHashList = Loader.Cardano.PlutusList.new()
    innerInnerStakingCredentialHashList.add(Loader.Cardano.PlutusData.new_bytes(fromHex(oCratorStakingKeyHash)))

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
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), addressObjList),
  )

  // address object consisting of pubkeyhash and scriptcredential
  fieldsInner.add(addressObject)

  // buy currency
  fieldsInner.add(Loader.Cardano.PlutusData.new_bytes(fromHex(oBuyCurrency)))
  fieldsInner.add(Loader.Cardano.PlutusData.new_bytes(fromHex(oBuyToken)))

  // sell currency
  fieldsInner.add(Loader.Cardano.PlutusData.new_bytes(fromHex(oSellCurrency)))
  fieldsInner.add(Loader.Cardano.PlutusData.new_bytes(fromHex(oSellToken)))

  // buy amount
  fieldsInner.add(Loader.Cardano.PlutusData.new_integer(Loader.Cardano.BigInt.from_str(oBuyAmount.toString())))

  // oAllowPartial
  if (oAllowPartial) {
    const booleanObject = Loader.Cardano.PlutusData.new_constr_plutus_data(
      Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('1'), Loader.Cardano.PlutusList.new()),
    )

    fieldsInner.add(booleanObject)
  } else {
    const booleanObject = Loader.Cardano.PlutusData.new_constr_plutus_data(
      Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), Loader.Cardano.PlutusList.new()),
    )

    fieldsInner.add(booleanObject)
  }

  const order = Loader.Cardano.PlutusList.new()

  order.add(
    Loader.Cardano.PlutusData.new_constr_plutus_data(
      Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), fieldsInner),
    ),
  )

  const order_datum = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), order),
  )

  return order_datum
}

// Datum used in Plutus V2
// FOR NOW WE ONLY HAVE ONE DATUM TYPE WITH CONSTRUCTOR INTEGER 0
export const getOrderbookV2Datum = (
  oCreatorPubKeyHash,
  oCratorStakingKeyHash,
  oBuyCurrency,
  oBuyToken,
  oSellCurrency,
  oSellToken,
  oBuyAmount,
  lovelaceAttached,
) => {
  // in a later step we might want to force full matches (instant swap for example)
  const oAllowPartial = true

  const fieldsInner = Loader.Cardano.PlutusList.new()

  // address Object pubKeyHash + stakingCredentialHash
  const addressObjList = Loader.Cardano.PlutusList.new()

  // represent PubKeyHash
  const pubKeyHashList = Loader.Cardano.PlutusList.new()

  pubKeyHashList.add(Loader.Cardano.PlutusData.new_bytes(fromHex(oCreatorPubKeyHash)))

  const pubKeyHashConstr = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), pubKeyHashList),
  )

  addressObjList.add(pubKeyHashConstr)

  const stakingCredentialHashList = Loader.Cardano.PlutusList.new()

  // represent StakingCredential
  if (oCratorStakingKeyHash) {
    const innerInnerStakingCredentialHashList = Loader.Cardano.PlutusList.new()
    innerInnerStakingCredentialHashList.add(Loader.Cardano.PlutusData.new_bytes(fromHex(oCratorStakingKeyHash)))

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
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), addressObjList),
  )

  // address object consisting of pubkeyhash and scriptcredential
  fieldsInner.add(addressObject)

  // buy currency
  fieldsInner.add(Loader.Cardano.PlutusData.new_bytes(fromHex(oBuyCurrency)))
  fieldsInner.add(Loader.Cardano.PlutusData.new_bytes(fromHex(oBuyToken)))

  // sell currency
  fieldsInner.add(Loader.Cardano.PlutusData.new_bytes(fromHex(oSellCurrency)))
  fieldsInner.add(Loader.Cardano.PlutusData.new_bytes(fromHex(oSellToken)))

  // buy amount
  fieldsInner.add(Loader.Cardano.PlutusData.new_integer(Loader.Cardano.BigInt.from_str(oBuyAmount.toString())))

  // oAllowPartial
  if (oAllowPartial) {
    const booleanObject = Loader.Cardano.PlutusData.new_constr_plutus_data(
      Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('1'), Loader.Cardano.PlutusList.new()),
    )

    fieldsInner.add(booleanObject)
  } else {
    const booleanObject = Loader.Cardano.PlutusData.new_constr_plutus_data(
      Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), Loader.Cardano.PlutusList.new()),
    )

    fieldsInner.add(booleanObject)
  }

  const lovelaceAttachedObj = Loader.Cardano.PlutusData.new_integer(
    Loader.Cardano.BigInt.from_str(lovelaceAttached.toString()),
  )
  fieldsInner.add(lovelaceAttachedObj)

  const order = Loader.Cardano.PlutusList.new()

  order.add(
    Loader.Cardano.PlutusData.new_constr_plutus_data(
      Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), fieldsInner),
    ),
  )

  const order_datum = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), order),
  )

  return order_datum
}

// Redeemer
export const getCancelPlutusV1Redeemer = (index) => {
  const redeemerData = Loader.Cardano.PlutusData.new_constr_plutus_data(
    Loader.Cardano.ConstrPlutusData.new(Loader.Cardano.BigNum.from_str('0'), Loader.Cardano.PlutusList.new()),
  )

  const redeemer = Loader.Cardano.Redeemer.new(
    Loader.Cardano.RedeemerTag.new_spend(),
    Loader.Cardano.BigNum.from_str(index),
    redeemerData,
    Loader.Cardano.ExUnits.new(Loader.Cardano.BigNum.from_str('1000000'), Loader.Cardano.BigNum.from_str('500000000')),
  )

  return redeemer
}
