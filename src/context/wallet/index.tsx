import { ConnectorName } from 'config/walletConnectors'
import useToasts from 'hooks/useToasts'
import { createContext, useCallback, useEffect, useMemo, useState } from 'react'
import { Text } from 'rebass/styled-components'
import { useDisconnectWallet, useIsDAppConnector, useUpdateWalletConnector, useWalletConnector } from 'state/user/hooks'

import {
  enable,
  getBalance,
  getChangeAddress,
  getCollateral,
  getNetworkId,
  getRewardAddresses,
  getUnusedAddresses,
  getUsedAddresses,
  getUtxos,
  isEnabled,
  retreiveWalletApi,
  signData,
  signTx,
  submitTx,
} from './helpers'
import { WalletContextType, WalletProtoApiType } from './types'

export const WalletContext = createContext<WalletContextType>(undefined)

export function WalletProvider({ children }) {
  const [dAppFeeAddress, setDAppFeeAddress] = useState(null)

  const [wallet, setWallet] = useState<WalletProtoApiType>()
  const [isWalletEnabled, setWalletEnabled] = useState(false)

  const connectorId = useWalletConnector()
  const isDAppConnector = useIsDAppConnector()
  const disconnectWallet = useDisconnectWallet()
  const setConnectorId = useUpdateWalletConnector()

  const { error, success } = useToasts()

  const enableDAppWallet = useCallback(
    (initApi, connectorName) => {
      initApi
        .enable()
        .then((walletApi) => {
          setWallet(walletApi)
          setConnectorId(connectorName, true)
          setDAppFeeAddress(initApi.experimental?.feeAddress ?? null)
          setWalletEnabled(true)
        })
        .catch(() => {
          error(
            <>
              <Text variant="subheading">Could not Connect to Wallet</Text>
              <Text variant="regular">You have to allow access!</Text>
            </>,
          )
        })
    },
    [setWallet, setConnectorId, error],
  )

  const isWalletInstalled = useCallback((connId: ConnectorName) => {
    try {
      retreiveWalletApi(connId, false)
      return true
    } catch (err) {
      return false
    }
  }, [])

  const enableWallet = useCallback(
    (connId: ConnectorName) => {
      enable(connId)
        .then((walletApi) => {
          setWallet(walletApi)
          setConnectorId(connId)
          setWalletEnabled(true)
        })
        .then(() => {
          success(
            <>
              <Text variant="subheading">Successfully Connected!</Text>
              <Text variant="regular">Connected to your {connId} wallet</Text>
            </>,
          )
        })
        .catch(() => {
          error(
            <>
              <Text variant="subheading">Could not Connect to Wallet</Text>
              <Text variant="regular">
                If the wallet extension is installed, you may need to allow access in your settings.
              </Text>
            </>,
          )
        })
    },
    [setWallet, setConnectorId, error, success],
  )

  const [reloading, setReloading] = useState(false)
  const reloadWallet = useCallback(() => {
    setReloading(true)
    // TODO pjordan: Add support for DApp
    if (!reloading) {
      enable(connectorId)
        .then((walletApi) => {
          setWallet(walletApi)
          setWalletEnabled(true)
        })
        .then(() => {
          setReloading(false)
          success(
            <>
              <Text variant="subheading">Switched Wallet!</Text>
              <Text variant="regular">
                We detected that you switched your connected wallet and reloaded correspondingly for you.
              </Text>
            </>,
          )
        })
        .catch(() => {
          error(
            <>
              <Text variant="subheading">Could not Switch Wallet</Text>
              <Text variant="regular">
                We detected that you switched your connected wallet. We couldn&apos;t reload it properly. <br />
                Please reload the page.
              </Text>
            </>,
          )
        })
    }
  }, [reloading, connectorId, error, success])

  const disableWallet = useCallback(() => {
    setWallet(undefined)
    disconnectWallet()
    setWalletEnabled(false)
    success(
      <>
        <Text variant="subheading">Successfully Disconnected!</Text>
        <Text variant="regular">
          You can always reconnect instantly. To learn how to disconnect your wallet completetly check out our guide.
        </Text>
      </>,
    )
  }, [setWalletEnabled, disconnectWallet, success])

  useEffect(() => {
    if (connectorId && !isWalletEnabled) {
      const quickConnect = () => {
        if (connectorId && !isWalletEnabled) {
          isEnabled(connectorId).then(
            (val) =>
              val &&
              enable(connectorId).then((walletApi) => {
                setWallet(walletApi)
                setWalletEnabled(true)
              }),
          )
        }
      }

      // Try connecting a few times, in case the injection into the namespace takes a little bit of time
      quickConnect()
      setTimeout(quickConnect, 200)
      setTimeout(quickConnect, 500)
      setTimeout(quickConnect, 1000)
    }
  }, [connectorId, isWalletEnabled])

  const walletApi = useMemo(
    () =>
      wallet &&
      connectorId &&
      !reloading && {
        getNetworkId: () => getNetworkId(wallet, connectorId),
        getUtxos: () => getUtxos(wallet, connectorId),
        getBalance: () => getBalance(wallet, connectorId),
        getUsedAddresses: (paginate?: unknown) => getUsedAddresses(wallet, connectorId, paginate),
        getUnusedAddresses: () => getUnusedAddresses(wallet, connectorId),
        getChangeAddress: () => getChangeAddress(wallet, connectorId),
        getRewardAddresses: () => getRewardAddresses(wallet, connectorId),
        signTx: (tx?: unknown, partialSign?: boolean) => signTx(wallet, connectorId, tx, partialSign),
        signData: (addr: unknown, sigStructure: unknown) => signData(wallet, connectorId, addr, sigStructure),
        submitTx: (tx: unknown) => submitTx(wallet, connectorId, tx),
        getCollateral: () => getCollateral(wallet, connectorId),
        disconnectWallet: async () => disableWallet(),
        isDAppConnector: () => isDAppConnector,
        dAppFeeAddress: () => dAppFeeAddress,
      },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [wallet, connectorId, disableWallet, isDAppConnector, dAppFeeAddress, reloading],
  )

  const contextValue = useMemo(
    () => ({
      connectorId,
      wallet: walletApi,
      reloadWallet,
      enableWallet,
      enableDAppWallet,
      isWalletEnabled,
      isWalletInstalled,
    }),
    [connectorId, walletApi, reloadWallet, enableWallet, enableDAppWallet, isWalletEnabled, isWalletInstalled],
  )

  return <WalletContext.Provider value={contextValue}> {children} </WalletContext.Provider>
}
