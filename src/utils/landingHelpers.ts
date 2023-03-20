interface Options {
  precision?: number
}

export function roundWithPrecision(number: number, options?: Options) {
  const precision = options?.precision ?? 0

  if (precision === 0) return Math.round(number)

  const value = 10 ** precision

  return Math.round(value * number) / value
}

export function getDifference(num1: number, num2: number) {
  const diff = roundWithPrecision(num2 - num1, { precision: 3 })
  const percentage = Math.round(((num1 - num2) / num2) * 100)

  return { diff, percentage }
}
