import { ButtonProps as BaseProps } from 'rebass/styled-components'
import { To } from 'react-router-dom'

declare module 'rebass/styled-components' {
  export interface ButtonProps extends BaseProps {
    to?: To
  }
}
