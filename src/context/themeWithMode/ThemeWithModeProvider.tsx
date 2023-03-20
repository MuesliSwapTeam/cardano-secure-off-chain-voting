import { useMemo } from 'react'
import { ThemeProvider, ThemeProviderProps, DefaultTheme } from 'styled-components'
import { useChangeThemeMode, useThemeMode } from 'state/user/hooks'

import { darkThemes, lightThemes } from '../../theme'
import Mode from './Mode'
import context from './context'

const { Provider } = context

const THEME_DICTIONARY = {
  [Mode.light]: lightThemes,
  [Mode.dark]: darkThemes,
}

type Props = Pick<ThemeProviderProps<DefaultTheme>, 'children'>

export default function ThemeWithModeProvider({ children }: Props) {
  const mode = useThemeMode()
  const setMode = useChangeThemeMode()

  const theme = THEME_DICTIONARY[mode]
  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => (mode === Mode.light ? setMode(Mode.dark) : setMode(Mode.light)),
    }),
    [mode, setMode],
  )

  return (
    <Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </Provider>
  )
}
