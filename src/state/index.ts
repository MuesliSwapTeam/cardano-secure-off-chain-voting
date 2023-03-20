import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { load, save } from 'redux-localstorage-simple'

import userReducer, { currentVersion } from './user'
import { updateVersion } from './user/actions'
import { UserState } from './user/types'

export interface State {
  user: UserState
}

const PERSISTED_KEYS: string[] = ['user']

export const appReducer = combineReducers({
  user: userReducer,
})

const store = configureStore({
  devTools: process.env.NODE_ENV !== 'production',
  reducer: appReducer,
  middleware: (getDefaultMiddleware) =>
    // disabling serializableCheck because our store is big and deeply nested
    getDefaultMiddleware({ serializableCheck: false }).concat([
      save({ states: PERSISTED_KEYS, disableWarnings: true }),
    ]),
  preloadedState: load({ states: PERSISTED_KEYS, disableWarnings: true }),
})

// TODO pjordan: Check how regularly this gets triggered...
// Check for new version
store.dispatch(updateVersion(currentVersion))

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch()

export default store
