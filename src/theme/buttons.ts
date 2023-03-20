import { SxStyleProp } from 'rebass/styled-components'
import { DefaultTheme } from 'styled-components'

const createButton = (style: SxStyleProp) => ({
  border: 'none',
  padding: '0 16px',

  fontSize: '16px',
  height: '40px',
  lineHeight: '24px',
  fontFamily: 'gilroy',
  fontWeight: 'semiBold',
  transition: '0.25s',
  borderRadius: '12px',
  overflow: 'hidden',

  svg: {
    position: 'relative',
    marginLeft: '10px',
    verticalAlign: 'middle',
    top: '-2px', // this needs to be done because of the font :-(
  },
  '&:disabled': {
    color: 'grey300',
    backgroundColor: 'primary64solid',
    boxShadow: 'none',
  },
  ...style,
})
const createLargeButton = (style: SxStyleProp) => ({
  ...style,
  padding: '0 16px',
  height: '48px',
  lineHeight: '50px',
})

const primary = createButton({
  color: 'white',
  bg: 'main',
  boxShadow: 'main',
  '&:not(:disabled)': {
    '&:hover': {
      bg: 'mainPressed',
    },
    '&:active': {
      bg: 'blue700',
    },
  },
})

const secondary = createButton({
  color: 'main',
  boxShadow: 'secondary',
  bg: 'primary',
  '&:not(:disabled)': {
    '&:hover': {
      bg: 'primary64solid',
    },
    '&:active': {
      bg: 'primary64solid',
    },
  },
})

const text = createButton({
  color: 'main',
  boxShadow: 'none',
  bg: 'transparent',
  '&:disabled': {
    bg: 'transparent',
  },
  '&:not(:disabled)': {
    '&:hover': {
      textDecoration: 'underline',
    },
    '&:active': {
      bg: 'blue100',
    },
  },
})

const icon = createButton({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'main',
  boxShadow: 'secondary',
  bg: 'primary',
  '&:not(:disabled)': {
    '&:hover': {
      bg: 'blue50',
    },
    '&:active': {
      bg: 'blue100',
    },
  },
  svg: {
    marginLeft: 0,
    top: 0,
    position: 'unset',
    verticalAlign: 'unset',
  },
})

const iconTransparent = createButton({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'text',
  boxShadow: 'none',
  bg: 'transparent',
  '&:disabled': {
    bg: 'transparent',
  },
  '&:not(:disabled)': {
    '&:hover': {
      color: 'main',
    },
    '&:active': {
      bg: 'blue100',
    },
  },
  svg: {
    marginLeft: 0,
    top: 0,
    position: 'unset',
    verticalAlign: 'unset',
  },
})

const BUTTONS: DefaultTheme['buttons'] = {
  primary,
  'primary-l': createLargeButton(primary),
  secondary,
  'secondary-l': createLargeButton(secondary),
  text,
  'text-l': createLargeButton(text),
  icon,
  'icon-transparent': iconTransparent,
}

export default BUTTONS
