import { ConnectorName } from 'config/walletConnectors'
import Mode from 'context/themeWithMode/Mode'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppState } from '..'
import {
  changeThemeMode,
  disconnectWallet,
  toggleReleaseNotes,
  updatePreferredHandle,
  updateWalletConnector,
} from './actions'
import { RelaseNotes, Version } from './types'

export const useReleaseNotes = (): RelaseNotes =>
  useSelector<AppState, AppState['user']['releaseNotes']>((state) => state.user.releaseNotes)

export const useToggleReleaseNotes = (): (() => void) => {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(toggleReleaseNotes())
  }, [dispatch])
}

export const useVersion = (): Version =>
  useSelector<AppState, AppState['user']['version']>((state) => state.user.version)

export const usePreferredHandle = (walletAddress?: string): string => {
  const handlePreferences = useSelector<AppState, AppState['user']['preferences']['preferredHandles']>(
    (state) => state.user.preferences.preferredHandles,
  )

  if (walletAddress) {
    return handlePreferences[walletAddress]
  }

  return undefined
}

export const useSetPreferredHandle = (walletAddress?: string): ((handle: string | undefined) => void) => {
  const dispatch = useDispatch()
  return useCallback(
    (handle: string | null) => {
      if (walletAddress) dispatch(updatePreferredHandle({ handle, walletAddress }))
    },
    [dispatch, walletAddress],
  )
}

export const useThemeMode = (): Mode =>
  useSelector<AppState, AppState['user']['preferences']['themeMode']>((state) => state.user.preferences.themeMode)

export const useChangeThemeMode = (): ((mode: Mode) => void) => {
  const dispatch = useDispatch()
  return useCallback(
    (mode: Mode) => {
      dispatch(changeThemeMode({ mode }))
    },
    [dispatch],
  )
}

export const useUpdateWalletConnector = (): ((walletConnector?: ConnectorName, isDApp?: boolean) => void) => {
  const dispatch = useDispatch()
  return useCallback(
    (walletConnector?: ConnectorName, isDApp?: boolean) => {
      dispatch(updateWalletConnector({ connector: walletConnector, isDApp }))
    },
    [dispatch],
  )
}

export function useWalletConnector(): ConnectorName {
  return useSelector<AppState, AppState['user']['wallet']['connector']>((state) => state.user.wallet?.connector)
}

export function useIsDAppConnector(): boolean {
  return useSelector<AppState, AppState['user']['wallet']['isDApp']>((state) => state.user.wallet?.isDApp)
}

export const useDisconnectWallet = (): (() => void) => {
  const dispatch = useDispatch()
  return useCallback(() => {
    dispatch(disconnectWallet())
  }, [dispatch])
}
