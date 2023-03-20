export default function getArrow(value: number) {
  if (value === 0) return ''
  if (value > 0) return '↑'
  return '↓'
}
