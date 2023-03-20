import { DECIMAL_SEPARATOR, localizeNormalString } from './numericHelpers'

export const sanitizeInputValue = (value: string, decimals: number) => {
  // remove leading zeros and minuses
  let sValue = localizeNormalString(value).replace(/^[0\\-]+(\d)/, '$1')
  // strip decimals beyond selected token's decimals
  const decimalIdx = sValue.indexOf(DECIMAL_SEPARATOR)
  if (decimalIdx >= 0) {
    sValue =
      decimals > 0
        ? sValue.substring(0, decimalIdx) + sValue.substring(decimalIdx, decimalIdx + decimals + 1)
        : sValue.substring(0, decimalIdx)
  }
  return sValue
}
