import { DayModeIcon, NightModeIcon } from 'assets/icons'
import useThemeWithMode from 'context/themeWithMode'
import Mode from 'context/themeWithMode/Mode'
import { Box } from 'rebass/styled-components'

import { Badge, HiddenInput, IconWrapper, ThemeSwitcherLabel } from './styled'

export default function ThemeSwitcher() {
  const { mode, toggleMode } = useThemeWithMode()
  const checked = mode === Mode.dark

  return (
    <ThemeSwitcherLabel aria-label="theme switcher">
      <HiddenInput type="checkbox" checked={checked} onChange={toggleMode} />
      <Badge />
      <IconWrapper>
        <Box as={DayModeIcon} height="18px" width="18px" />
      </IconWrapper>
      <IconWrapper>
        <Box as={NightModeIcon} height="18px" width="18px" />
      </IconWrapper>
    </ThemeSwitcherLabel>
  )
}
