import ConnectWalletModal from 'components/ConnectWalletModal'
import { useWallet } from 'hooks/useWallet'
import { useToggle } from 'react-use'
import { Box, Button } from 'rebass/styled-components'
import { useDisconnectWallet, useWalletConnector } from 'state/user/hooks'

import WalletDropDown from './WalletDropDown'

export default function ConnectWallet({ isWide }: { isWide: boolean }) {
  const { wallet } = useWallet()
  const disconnectWallet = useDisconnectWallet()
  const [toggleModal, setToggleModal] = useToggle(false)
  const walletConnectorName = useWalletConnector()

  if (walletConnectorName) {
    if (wallet) return <WalletDropDown disconnect={wallet.disconnectWallet} isWide={isWide} />

    // We are kinda stuck in a limbo, so just forget that we were ever connected
    return <WalletDropDown disconnect={disconnectWallet} isWide={isWide} />
  }
  return (
    <Box m="8px">
      <Button onClick={setToggleModal}>Connect wallet</Button>

      <ConnectWalletModal toggleModal={toggleModal} setToggleModal={setToggleModal} />
    </Box>
  )
}
