import { useMemo } from 'react'

export default function useIsFirstApril(): boolean {
  const { day, month } = useMemo(() => {
    const date = new Date()
    return { day: date.getDate(), month: date.getMonth() + 1 }
  }, [])
  return day === 1 && month === 4
}
