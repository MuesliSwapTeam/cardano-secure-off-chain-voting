import { createReducer } from '@reduxjs/toolkit'
import Mode from 'context/themeWithMode/Mode'

import {
  changeThemeMode,
  disconnectWallet,
  toggleReleaseNotes,
  updatePreferredHandle,
  updateVersion,
  updateWalletConnector,
} from './actions'
import { UserState, Version } from './types'

function isPreferredSystemThemeDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export const currentVersion: Version = {
  major: 0,
  minor: 1,
}

export const initialState: UserState = {
  releaseNotes: {
    show: false,
    prevVersion: currentVersion,
  },
  version: currentVersion,
  preferences: {
    themeMode: isPreferredSystemThemeDark() ? Mode.dark : Mode.light,
    preferredHandles: {},
  },
  wallet: {},
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(toggleReleaseNotes, (state) => ({
      ...state,
      releaseNotes: {
        ...state.releaseNotes,
        show: !state.releaseNotes.show,
      },
    }))
    .addCase(updateVersion, (state, { payload: newVersion }) => {
      // Uhoh store seems to be wrong, lets just replace it
      if (!state?.version) {
        return {
          ...initialState,
          releaseNotes: {
            show: false,
            prevVersion: initialState.version,
          },
        }
      }

      // Breaking changes introduced, therefore migrate preferences
      if (newVersion.major !== state.version.major) {
        // Oh, we changed a few things, but we can recover :)
        if (state.version.major <= 1 && state.version.minor === 0) {
          return {
            ...initialState,
            ...state,
            version: newVersion,
            releaseNotes: {
              show: true,
              prevVersion: state.version,
            },
          }
        }
        // Unsupported version upgrade, had to reset store
        return {
          ...initialState,
          releaseNotes: {
            show: true,
            prevVersion: state.version,
          },
        }
      }
      if (state.version.minor !== newVersion.minor) {
        // TODO pjordan: Figure out a deep object merge approach instead of having to do this by hand
        return {
          ...initialState,
          ...state,
          preferences: {
            ...initialState.preferences,
            ...state.preferences,
          },
          version: newVersion,
          releaseNotes: {
            show: false,
            prevVersion: state.version,
          },
        }
      }

      return state
    })
    .addCase(updatePreferredHandle, (state, { payload: { walletAddress, handle } }) => ({
      ...state,
      preferences: {
        ...state.preferences,
        preferredHandles: {
          ...state.preferences.preferredHandles,
          [walletAddress]: handle,
        },
      },
    }))
    .addCase(changeThemeMode, (state, { payload: { mode } }) => ({
      ...state,
      preferences: {
        ...state.preferences,
        themeMode: mode,
      },
    }))
    .addCase(updateWalletConnector, (state, { payload: { connector, isDApp } }) => ({
      ...state,
      wallet: {
        ...state.wallet,
        connector,
        isDApp,
      },
    }))
    .addCase(disconnectWallet, (state) => ({
      ...state,
      wallet: {
        ...state.wallet,
        connector: undefined,
        isDApp: false,
      },
    })),
)
