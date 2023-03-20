import Big from 'big.js'
import ReleaseNotes from 'components/common/ReleaseNotes'
import ToastContainer from 'components/common/ToastContainer'
import { CardanoProvider } from 'context/cardano'
import { WalletProvider } from 'context/wallet'
import React from 'react'
import ReactDOM from 'react-dom/client'
import ReactModal from 'react-modal'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import UserUpdater from 'state/user/updater'

import App from './App'
import ThemeWithModeProvider from './context/themeWithMode/ThemeWithModeProvider'
import GlobalCSS from './GlobalCSS'
import reportWebVitals from './reportWebVitals'
import ReduxStore from './state'

// Big configuration --> we never wanna fallback to exponential notation
Big.PE = 100
Big.NE = -100

// Add cardano to the window namespace
declare global {
  interface Window {
    cardano
  }
}

const ROOT_ID = 'root'
const root = ReactDOM.createRoot(document.getElementById(ROOT_ID) as HTMLElement)

ReactModal.setAppElement(`#${ROOT_ID}`)

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ReduxProvider store={ReduxStore}>
        <ThemeWithModeProvider>
          <ToastContainer />
          <ReleaseNotes />
          <CardanoProvider>
            <WalletProvider>
              <GlobalCSS />
              <App />
              <UserUpdater />
            </WalletProvider>
          </CardanoProvider>
        </ThemeWithModeProvider>
      </ReduxProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
