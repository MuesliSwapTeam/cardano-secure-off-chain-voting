import { CloseIcon } from 'assets/icons'
import Modal from 'components/common/Modal'
import ModalFooter from 'components/ConnectWalletModal/footer'
import Wallet from 'components/ConnectWalletModal/Wallet'
import { CONNECTOR_CONFIGURATIONS, ConnectorConfig, CONNECTORS } from 'config/walletConnectors'
import { useWallet } from 'hooks/useWallet'
import { Link } from 'react-router-dom'
import { useLockBodyScroll } from 'react-use'
import { Box, Button, Flex, Text } from 'rebass/styled-components'
import { useTheme } from 'styled-components'

interface Props {
  toggleModal: boolean
  setToggleModal: () => void
}

export default function ConnectWalletModal({ toggleModal, setToggleModal }: Props) {
  const { colors } = useTheme()
  const { enableWallet } = useWallet()

  const onClick = (walletConfig: ConnectorConfig) => {
    enableWallet(walletConfig.connectorId)
    setToggleModal()
  }

  useLockBodyScroll(toggleModal)

  return (
    <Modal
      isOpen={toggleModal}
      toggleModal={setToggleModal}
      contentProps={{
        background: colors.primary,
        margin: 'auto',
        maxWidth: 416,
        position: 'relative',
        borderRadius: 16,
      }}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        p="16px"
        sx={{
          borderBottomWidth: 1,
          borderBottomStyle: 'solid',
          borderBottomColor: 'secondary',
        }}
      >
        <Text variant="heading5">Connect your Wallet</Text>
        <Button variant="icon-transparent" onClick={setToggleModal}>
          <CloseIcon />
        </Button>
      </Flex>
      <Box p="20px">
        <Text variant="subtle" fontSize={['12px', '12px', '12px']} mb="16px">
          By connecting your wallet, you agree to our <Link to="terms">Terms of Service</Link> and our{' '}
          <Link to="privacy">Privacy Policy</Link>.
        </Text>

        {CONNECTORS.map((key) => (
          <Wallet key={key} item={CONNECTOR_CONFIGURATIONS[key]} onClick={onClick} />
        ))}
      </Box>
      <ModalFooter />
    </Modal>
  )
}
