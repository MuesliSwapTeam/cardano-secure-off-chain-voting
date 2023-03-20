import { useTheme } from 'styled-components'
import { MuesliIconDark, MuesliIconLight } from 'assets/icons'

export default function MuesliIcon() {
  const { isDark } = useTheme()

  return isDark ? <MuesliIconDark /> : <MuesliIconLight />
}
