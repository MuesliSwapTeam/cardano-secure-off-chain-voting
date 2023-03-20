import { EternlIcon, FlintIcon, GeroIcon, NamiIcon, NufiIcon, TyphonIcon } from 'assets/icons/wallets'
import { FC, SVGAttributes } from 'react'
import { DefaultTheme } from 'styled-components'

// eslint-disable-next-line import/no-extraneous-dependencies
import { SpaceProps } from 'styled-system'

export interface SvgProps extends SVGAttributes<HTMLOrSVGElement>, SpaceProps {
  theme?: DefaultTheme
  spin?: boolean
}

export enum ConnectorName {
  Nami = 'Nami',
  Gero = 'Gero',
  Eternl = 'Eternl',
  Flint = 'Flint',
  Typhon = 'Typhon',
  Nufi = 'Nufi',
}

export interface ConnectorConfig {
  title: string
  icon: FC<SvgProps>
  connectorId: ConnectorName
  experimental?: boolean
  isAvailable?: boolean
  url: string
}

export const CONNECTOR_CONFIGURATIONS: { [name: string]: ConnectorConfig } = {
  Nami: {
    title: 'Nami Wallet',
    icon: NamiIcon,
    connectorId: ConnectorName.Nami,
    url: 'https://namiwallet.io/',
  },
  Gero: {
    title: 'Gero Wallet',
    icon: GeroIcon,
    connectorId: ConnectorName.Gero,
    url: 'https://www.gerowallet.io/',
  },
  Eternl: {
    title: 'Eternl Wallet',
    icon: EternlIcon,
    connectorId: ConnectorName.Eternl,
    url: 'https://chrome.google.com/webstore/detail/ccvaultio/kmhcihpebfmpgmihbkipmjlmmioameka',
  },
  Flint: {
    title: 'Flint Wallet',
    icon: FlintIcon,
    connectorId: ConnectorName.Flint,
    experimental: false,
    url: 'https://chrome.google.com/webstore/detail/flint/hnhobjmcibchnmglfbldbfabcgaknlkj/related?hl=en',
  },
  Typhon: {
    title: 'Typhon Wallet',
    icon: TyphonIcon,
    connectorId: ConnectorName.Typhon,
    experimental: true,
    url: 'https://chrome.google.com/webstore/detail/typhon-wallet/kfdniefadaanbjodldohaedphafoffoh',
  },
  Nufi: {
    title: 'Nufi Wallet',
    icon: NufiIcon,
    connectorId: ConnectorName.Nufi,
    url: 'https://nu.fi/',
  },
}

export const CONNECTORS: ConnectorName[] = [
  ConnectorName.Nami,
  ConnectorName.Gero,
  ConnectorName.Eternl,
  ConnectorName.Flint,
  ConnectorName.Typhon,
  ConnectorName.Nufi,
]
