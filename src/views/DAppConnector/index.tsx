import { ErrorPopover } from 'components/common/Errors'
import { LoadingPopover } from 'components/common/Loaders'
import Page from 'components/common/Page'
import { ConnectorName } from 'config/walletConnectors'
import { useWallet } from 'hooks/useWallet'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEffectOnce } from 'react-use'
import { Text } from 'rebass/styled-components'

import { initCardanoDAppConnectorBridge } from './cardano-dapp-connector-bridge'

export default function DAppConnector() {
  const { enableDAppWallet } = useWallet()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [finished, setFinished] = useState(false)
  const [error, setError] = useState(undefined)

  useEffectOnce(() => {
    if (!loading) {
      setLoading(true)
      initCardanoDAppConnectorBridge(async (walletApi) => {
        if (walletApi.name === 'eternl') {
          enableDAppWallet(walletApi, ConnectorName.Eternl)
        } else {
          setError('Unknown connector!')
        }
        setFinished(true)
      })
    }
  })

  useEffect(() => {
    if (finished) navigate('/swap')
  }, [finished, navigate])

  return (
    <Page title="Connecting DApp...">
      <LoadingPopover />
      {finished && error && (
        <ErrorPopover>
          <Text variant="subheading">
            Connecting with the DApp failed: <br />
            {error}
          </Text>
        </ErrorPopover>
      )}
    </Page>
  )
}
