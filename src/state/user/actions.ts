import { createAction } from '@reduxjs/toolkit'
import { ConnectorName } from 'config/walletConnectors'
import Mode from 'context/themeWithMode/Mode'

import { Version } from './types'

export const updateVersion = createAction<Version>('user/updateVersion')
export const toggleReleaseNotes = createAction<Version>('user/toggleReleaseNotes')

export const updatePreferredHandle = createAction<{ handle: string; walletAddress: string }>(
  'user/updatePreferredHandle',
)

export const changeThemeMode = createAction<{ mode: Mode }>('user/changeThemeMode')

export const updateWalletConnector = createAction<{ connector: ConnectorName; isDApp: boolean }>(
  'user/updateWalletConnector',
)
export const disconnectWallet = createAction<void>('user/disconnectWallet')
