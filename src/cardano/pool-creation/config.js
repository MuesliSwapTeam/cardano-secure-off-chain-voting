import MultiPlatformLoader from 'cardano/pool-creation/loader.js'
import { updatedCostModel, plutusV2CostModel } from 'cardano/helpers/languageViews'

export const getMultiPlatformTXBuilderConfig = async (protocolParameters) => {
  await MultiPlatformLoader.load()

  const costmdls = MultiPlatformLoader.Cardano.Costmdls.new()

  // build PlutusV1 costmodel
  const plutusV1Language = MultiPlatformLoader.Cardano.Language.new_plutus_v1()
  const costmdl = MultiPlatformLoader.Cardano.CostModel.empty_model(plutusV1Language)
  updatedCostModel.cost.forEach((cost, index) => {
    costmdl.set(index, MultiPlatformLoader.Cardano.Int.new_i32(cost))
  })

  // build PlutusV2 costmodel
  const plutusV2Language = MultiPlatformLoader.Cardano.Language.new_plutus_v2()
  const costmdlV2 = MultiPlatformLoader.Cardano.CostModel.empty_model(plutusV2Language)
  plutusV2CostModel.cost.forEach((cost, index) => {
    costmdlV2.set(index, MultiPlatformLoader.Cardano.Int.new_i32(cost))
  })

  costmdls.insert(costmdl)
  costmdls.insert(costmdlV2)

  var Fraction = require('fractional').Fraction

  const priceMemFranction = new Fraction(protocolParameters.priceMem)
  const priceMemFranctionNumerator = MultiPlatformLoader.Cardano.BigNum.from_str(priceMemFranction.numerator.toString())
  const priceMemFranctionDenominator = MultiPlatformLoader.Cardano.BigNum.from_str(
    priceMemFranction.denominator.toString(),
  )
  const priceMem = MultiPlatformLoader.Cardano.UnitInterval.new(
    priceMemFranctionNumerator,
    priceMemFranctionDenominator,
  )

  const priceStepFranction = new Fraction(protocolParameters.priceStep)
  const priceStepFranctionNumerator = MultiPlatformLoader.Cardano.BigNum.from_str(
    priceStepFranction.numerator.toString(),
  )
  const priceStepFranctionDenominator = MultiPlatformLoader.Cardano.BigNum.from_str(
    priceStepFranction.denominator.toString(),
  )
  const priceStep = MultiPlatformLoader.Cardano.UnitInterval.new(
    priceStepFranctionNumerator,
    priceStepFranctionDenominator,
  )

  const exUnitPrices = MultiPlatformLoader.Cardano.ExUnitPrices.new(priceMem, priceStep)
  const coinsPerUtxoByte = Math.ceil(Number(protocolParameters.coinsPerUtxoByte))

  const txBuilderConfig = MultiPlatformLoader.Cardano.TransactionBuilderConfigBuilder.new()
    .coins_per_utxo_byte(MultiPlatformLoader.Cardano.BigNum.from_str('4170'))
    .fee_algo(
      MultiPlatformLoader.Cardano.LinearFee.new(
        MultiPlatformLoader.Cardano.BigNum.from_str(protocolParameters.linearFee.minFeeA),
        MultiPlatformLoader.Cardano.BigNum.from_str((Number(protocolParameters.linearFee.minFeeB) + 4401).toString()),
      ),
    )
    .key_deposit(MultiPlatformLoader.Cardano.BigNum.from_str(protocolParameters.keyDeposit))
    .pool_deposit(MultiPlatformLoader.Cardano.BigNum.from_str(protocolParameters.poolDeposit))
    .max_tx_size(protocolParameters.maxTxSize)

    .max_value_size(protocolParameters.maxValSize)
    .ex_unit_prices(exUnitPrices)
    .prefer_pure_change(false)
    .costmdls(costmdls)
    .max_collateral_inputs(3)
    .collateral_percentage(150)
    .build()

  return txBuilderConfig
}
