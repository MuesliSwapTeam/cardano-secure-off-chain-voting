import 'styled-components'

import { SxStyleProp } from 'rebass/styled-components'

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      background: string
      imageBackground: string
      primary: string
      primary64solid: string
      primary64: string
      main: string
      mainPressed: string
      text: string
      textSubtle: string
      secondary: string
      link: string
      list: string
      blue50: string
      blue100: string
      blue200: string
      blue300: string
      blue400: string
      blue700: string
      green: string
      green50: string
      red: string
      red50: string
      grey: string
      grey50: string
      grey100: string
      grey200: string
      grey300: string
      grey500: string
      grey600: string
      grey700: string
      grey800: string
      grey900: string
      violet100: string
      violet500: string
      scam: string
      unverified: string
      outdated: string
    }
    fonts: {
      gilroy: "'Gilroy', sans-serif"
      inter: "'Inter', sans-serif"
    }
    fontWeights: {
      regular: '400'
      medium: '500'
      semiBold: '600'
      bold: '700'
    }
    fontSizes: number[]
    breakpoints: string[]
    defaultFontSize: string[]
    isDark: boolean
    shadows: {
      main: string
      secondary: string
      tooltip: string
    }
    buttons: Record<
      'primary' | 'primary-l' | 'secondary' | 'secondary-l' | 'text' | 'text-l' | 'icon' | 'icon-transparent',
      SxStyleProp
    >
    text: Record<
      | 'regular'
      | 'tiny'
      | 'subtle'
      | 'subheading'
      | 'heading1'
      | 'heading2'
      | 'heading3'
      | 'heading4'
      | 'heading5'
      | 'heading6',
      SxStyleProp
    >
    variants: Record<'link', SxStyleProp>
  }
}
