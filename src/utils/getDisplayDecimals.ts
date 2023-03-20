import Big from 'big.js'

import { fromNativeAmount } from './numericHelpers'

export default function getDisplayDecimals(nativeAmount: string | number | Big, amountDecimals?: number): number {
  const amount = fromNativeAmount(nativeAmount, amountDecimals ?? 0).abs()
  const decimalPlaces = Math.max(amountDecimals ?? 0, 4)

  if (Big(amount).cmp(0) === 0) {
    return 0
  }

  if (Big(amount).cmp(Big(1).div(decimalPlaces)) < 0) {
    return Math.round(Math.log10(Big(1).div(amount).toNumber())) + 3
  }

  return decimalPlaces
}
