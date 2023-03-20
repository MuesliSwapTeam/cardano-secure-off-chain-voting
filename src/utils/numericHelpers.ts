import Big from 'big.js'

const GROUPING_REFERENCE_STRING = (100000000)
  .toLocaleString()
  .replaceAll((1).toLocaleString(), '')
  .replaceAll((0).toLocaleString(), '')
const DECIMAL_REFERENCE_STRING = (0)
  .toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  .replaceAll((0).toLocaleString(), '')
export const GROUPING_SEPARATOR = GROUPING_REFERENCE_STRING?.length ? GROUPING_REFERENCE_STRING[0] : ''
export const DECIMAL_SEPARATOR = DECIMAL_REFERENCE_STRING?.length ? DECIMAL_REFERENCE_STRING[0] : '' // Let's hope this edge case never happens 😅

export const LOCALE_TO_EN_NUMBER_MAP = {
  [(0).toLocaleString()]: '0',
  [(1).toLocaleString()]: '1',
  [(2).toLocaleString()]: '2',
  [(3).toLocaleString()]: '3',
  [(4).toLocaleString()]: '4',
  [(5).toLocaleString()]: '5',
  [(6).toLocaleString()]: '6',
  [(7).toLocaleString()]: '7',
  [(8).toLocaleString()]: '8',
  [(9).toLocaleString()]: '9',
}

export function localizeNormalNumber(number: number | Big): string {
  if (!number) return (0).toLocaleString()

  if (typeof number === 'number') {
    return number
      .toLocaleString(undefined, { maximumFractionDigits: 20, maximumSignificantDigits: 21 })
      .replaceAll(GROUPING_SEPARATOR, '')
  }

  return number
    .toNumber()
    .toLocaleString(undefined, { maximumFractionDigits: 20, maximumSignificantDigits: 21 })
    .replaceAll(GROUPING_SEPARATOR, '')
}

export function localizeNormalString(number: string): string {
  if (!number) return (0).toLocaleString()

  return number.replaceAll(GROUPING_SEPARATOR, '')
}

export function normalizeLocaleNumber(localeNumber: string): string {
  if (!localeNumber) return '0'

  let result = localeNumber.replaceAll(GROUPING_SEPARATOR, '').replace(DECIMAL_SEPARATOR, '.')
  Object.entries(LOCALE_TO_EN_NUMBER_MAP).forEach(([loc, en]) => {
    result = result.replaceAll(loc, en)
  })

  return result
}

export function toNativeAmount(x: Big | string | number, decimals: number): string {
  if (!x) return '0'

  return Big(x.toString())
    .mul(10 ** decimals)
    .toFixed(0, Big.roundDown)
}

export function fromNativeAmount(x: bigint | string | Big | number, decimals: number): Big {
  if (!x) return Big('0')

  return Big(x.toString()).div(10 ** decimals)
}

export enum NumberFormatVariants {
  STANDARD = 'standard',
  COMPACT = 'compact',
  SCIENTIFIC = 'scientific',
}

export function formatNumber(
  x: Big | string | number,
  decimals: number,
  variant?: NumberFormatVariants,
  minDecimals?: number,
) {
  let formatOptions
  switch (variant) {
    case NumberFormatVariants.COMPACT:
      formatOptions = {
        minimumFractionDigits: minDecimals ?? 0,
        maximumFractionDigits: Math.min(Math.max(decimals, 0), 20),
        notation: 'compact',
        compactDisplay: 'short',
      }
      break
    case NumberFormatVariants.SCIENTIFIC:
      formatOptions = {
        notation: 'scientific',
      }
      break
    case NumberFormatVariants.STANDARD:
    default:
      formatOptions = {
        minimumFractionDigits: minDecimals ?? 0,
        maximumFractionDigits: Math.min(Math.max(decimals, 0), 20),
      }
  }
  const numberFormat = Intl.NumberFormat(undefined, formatOptions)

  return numberFormat.format(Big(x).round(Math.max(decimals, 0), Big.roundHalfEven).toNumber())
}

export function formatNumberFixed(x: Big | string | number, decimals: number, variant?: NumberFormatVariants) {
  return formatNumber(x, decimals, variant, decimals)
}
