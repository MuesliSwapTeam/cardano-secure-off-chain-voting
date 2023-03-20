import { SxStyleProp } from 'rebass/styled-components'
import { DefaultTheme } from 'styled-components'

import buttons from './buttons'

const COMMON_TEXT: SxStyleProp = {
  color: 'text',
  fontFamily: 'inter',
  fontWeight: 400,
  // line height set by default to 1.5 for better readability
  lineHeight: '1.5',
  // letter spacing set by default by user agent
}

const COMMON_HEADING: SxStyleProp = {
  color: 'text',
  fontWeight: 600,
  fontFamily: 'gilroy',
}

const BREAKPOINTS = [750, 1920]

const getScaledFontSize = (min: number, max: number): [string, string, string] => {
  const sizeRatio = (BREAKPOINTS[1] - BREAKPOINTS[0]) / (max - min)
  const scaledSize = `calc(${min}px + (100vw - ${BREAKPOINTS[0]}px) / ${sizeRatio})`
  return [`${min}px`, scaledSize, `${max}px`]
}

const COMMON_THEME: Pick<
  DefaultTheme,
  'fonts' | 'breakpoints' | 'buttons' | 'text' | 'fontWeights' | 'defaultFontSize' | 'fontSizes' | 'variants'
> = {
  fonts: {
    gilroy: "'Gilroy', sans-serif",
    inter: "'Inter', sans-serif",
  },
  fontWeights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
  },
  fontSizes: [12, 14, 16, 18, 24, 32, 40, 56, 64],
  // TODO (matus): modify breakpoints when margins change (to make fonts look ok)
  breakpoints: BREAKPOINTS.map((x) => `${x}px`),
  defaultFontSize: getScaledFontSize(14, 16),
  buttons,
  text: {
    // this is the default "paragraph" style between 14 and 16 px
    regular: {
      ...COMMON_TEXT,
      fontSize: getScaledFontSize(14, 16),
      letterSpacing: 0,
    },
    // this is the tiniest text that doesn't get bigger on a bigger screen
    // probably we should define this inline since they're all a bit different
    tiny: {
      ...COMMON_TEXT,
      fontSize: ['14px'],
      lineHeight: ['14px'],
      letterSpacing: 0,
    },
    // same as regular, only with a subtle grey color
    // probably we can also define this inline
    subtle: {
      ...COMMON_TEXT,
      color: 'textSubtle',
      fontSize: getScaledFontSize(14, 16),
      letterSpacing: 0,
    },
    // Used in e.g. in cards or as list heading
    subheading: {
      ...COMMON_TEXT,
      fontSize: getScaledFontSize(16, 18),
      fontWeight: 600,
      fontFamily: 'gilroy',
      letterSpacing: 0,
    },
    heading1: {
      ...COMMON_HEADING,
      fontSize: getScaledFontSize(40, 64),
      lineHeight: 1.25,
      letterSpacing: -0.64,
    },
    heading2: {
      ...COMMON_HEADING,
      fontSize: getScaledFontSize(32, 56),
      lineHeight: 1.14,
      letterSpacing: -1.6,
    },
    heading3: {
      ...COMMON_HEADING,
      fontSize: getScaledFontSize(24, 42),
      lineHeight: 1.12,
      letterSpacing: 0,
    },
    heading4: {
      ...COMMON_HEADING,
      fontSize: getScaledFontSize(21, 32),
      lineHeight: 1.12,
      letterSpacing: -0.33,
    },
    heading5: {
      ...COMMON_HEADING,
      fontSize: getScaledFontSize(21, 24),
      lineHeight: 1.16,
      letterSpacing: 0,
    },
    heading6: {
      ...COMMON_HEADING,
      fontSize: getScaledFontSize(16, 24),
      lineHeight: 1.33,
      letterSpacing: 0,
    },
  },
  variants: {
    link: {
      ...COMMON_TEXT,
      fontSize: getScaledFontSize(14, 16),
      letterSpacing: 0,
      color: 'link',
    },
  },
}

export const lightThemes: DefaultTheme = {
  ...COMMON_THEME,
  isDark: false,
  colors: {
    background: '#EEF3FD',
    imageBackground: '#ffffff',
    primary: '#fff',
    primary64solid: '#f3f5fe',
    primary64: '#ffffffa3',
    main: '#5346ff',
    mainPressed: '#6b5fff',
    text: '#0c1629',
    textSubtle: '#3c4555',
    secondary: '#e5e9f1',
    link: '#5346ff',
    list: '#eff2f8',
    blue50: '#f2f1ff',
    blue100: '#dfddff',
    blue200: '#c8c3ff',
    blue300: '#9189FF',
    blue400: '#6b5fff',
    blue700: '#2112DA',
    green: '#0fc43b',
    green50: '#e9faed',
    red: '#ff5a5a',
    red50: '#ffeded',
    grey: '#ccc',
    grey50: '#f8fafd',
    grey100: '#eff2f8',
    grey200: '#e5e9f1',
    grey300: '#cfd6e4',
    grey500: '#7c8597',
    grey600: '#5d6573',
    grey700: '#3c4555',
    grey800: '#252E40',
    grey900: '#0c1629',
    violet100: '#f1d7ff',
    violet500: '#bf46ff',
    scam: '#f5aca6',
    unverified: '#fff8c4',
    outdated: '#BEBEBE',
  },
  shadows: {
    main: '0 2px 0 0 #2112da',
    secondary: '0 2px 0 0 #dfddff',
    tooltip: '0 0 5px 0 #cccccc',
  },
}

export const darkThemes: DefaultTheme = {
  ...COMMON_THEME,
  isDark: true,
  colors: {
    background: '#151F32',
    imageBackground: '#252E40',
    primary: '#0c1629',
    primary64solid: '#2c3346',
    primary64: '#0c1629a3',
    main: '#5346ff',
    mainPressed: '#6b5fff',
    text: '#fff',
    textSubtle: '#CFD6E4',
    secondary: '#252E40',
    link: '#5e52ff',
    list: '#252E40',
    blue50: '#f2f1ff',
    blue100: '#dfddff',
    blue200: '#c8c3ff',
    blue300: '#9189FF',
    blue400: '#6b5fff',
    blue700: '#2112DA',
    green: '#0fc43b',
    green50: '#e9faed',
    red: '#ff5a5a',
    red50: '#ffeded',
    grey: '#ccc',
    grey50: '#f8fafd',
    grey100: '#eff2f8',
    grey200: '#e5e9f1',
    grey300: '#cfd6e4',
    grey500: '#7c8597',
    grey600: '#5d6573',
    grey700: '#3c4555',
    grey800: '#252E40',
    grey900: '#0c1629',
    violet100: '#f1d7ff',
    violet500: '#bf46ff',
    scam: '#CC3333',
    unverified: '#ffae5a',
    outdated: '#787878',
  },
  shadows: {
    main: '0 2px 0 0 #0c1629',
    secondary: '0 2px 0 0 #222222',
    tooltip: '0 0 1px 0 #000000',
  },
}
