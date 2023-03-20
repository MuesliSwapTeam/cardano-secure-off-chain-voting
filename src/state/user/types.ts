import { ConnectorName } from 'config/walletConnectors'
import Mode from 'context/themeWithMode/Mode'

export interface Preferences {
  themeMode: Mode
  preferredHandles: { [walletAddress: string]: string | null } // null means display address and ignore handle
}

export interface WalletConfiguration {
  connector?: ConnectorName
  isDApp?: boolean
}

export interface UserState {
  releaseNotes: RelaseNotes
  version: Version
  preferences: Preferences
  wallet: WalletConfiguration
}

export interface RelaseNotes {
  show: boolean
  prevVersion: Version
}

export interface Version {
  major: number
  minor: number
}
