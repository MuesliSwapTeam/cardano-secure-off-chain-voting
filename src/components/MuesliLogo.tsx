import { useTheme } from 'styled-components'
import { MuesliLogoDark, MuesliLogoLight } from 'assets/icons'

export default function MuesliLogo() {
  const { isDark } = useTheme()

  return isDark ? <MuesliLogoDark /> : <MuesliLogoLight />
}
