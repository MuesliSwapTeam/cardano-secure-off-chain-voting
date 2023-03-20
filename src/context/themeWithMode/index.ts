import { useContext } from 'react'
import themeWithMode from './context'

export default function useThemeWithMode() {
  const context = useContext(themeWithMode)

  if (context === undefined) {
    throw new Error('useThemeWithMode must be used within a ThemeWithModeProvider')
  }

  return context
}
