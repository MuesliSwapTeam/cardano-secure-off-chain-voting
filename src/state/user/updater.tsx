import useToasts from 'hooks/useToasts'
import { useWallet } from 'hooks/useWallet'
import { useEffect, useState } from 'react'
import { useInterval } from 'react-use'
import { Text } from 'rebass/styled-components'
import { getNetworkId, Network, setNetworkId } from 'utils/networkId'

export default function UserUpdater() {
  const { info } = useToasts()
  const { wallet, reloadWallet } = useWallet()

  const [accountChanged, setAccountChanged] = useState(false)

  // Regularly check the network id and update if necessary
  useInterval(() => {
    if (wallet?.getNetworkId) {
      wallet.getNetworkId().then(
        (currNetworkId: Network) => {
          if (currNetworkId !== getNetworkId()) {
            setNetworkId(currNetworkId)
            info(
              <>
                <Text variant="subheading">Switched Networks!</Text>
                <Text variant="regular">
                  We detected that you changed your wallet network to{' '}
                  {currNetworkId === Network.MAINNET ? 'mainnet' : 'testnet'}.
                  {currNetworkId === Network.TESTNET && (
                    <>
                      <br />
                      We currently don&apos;t have testnet support. <br />
                      Therefore some parts of this site might not work as expected
                    </>
                  )}
                </Text>
              </>,
            )
          }
        },
        () => {
          // TODO pjordan: I should actually use the error code here instead, as this might also be caused by other errors
          if (!accountChanged) setAccountChanged(true)
        },
      )
    }
  }, 4000)

  // Regularly check if the user switched the wallet
  useEffect(() => {
    if (accountChanged) {
      reloadWallet()
    }
    setAccountChanged(false)
  }, [accountChanged, wallet, setAccountChanged, info, reloadWallet])

  return undefined
}
