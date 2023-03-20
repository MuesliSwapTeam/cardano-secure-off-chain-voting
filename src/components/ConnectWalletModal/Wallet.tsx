import { StyledInstallButton, StyledWallet } from 'components/ConnectWalletModal/styled'
import { ConnectorConfig } from 'config/walletConnectors'
import { useWallet } from 'hooks/useWallet'
import { Flex, Image, Text } from 'rebass/styled-components'
import openInNewTab from 'utils/openInNewTab'

interface Props {
  item: ConnectorConfig
  onClick: (arg: ConnectorConfig) => void
}

export default function Wallet({ item, onClick }: Props) {
  const handleClick = () => onClick(item)
  const { isWalletInstalled } = useWallet()

  return (
    <Flex justifyContent="space-between" alignItems="center" m="10px -10px">
      <StyledWallet onClick={handleClick}>
        <Flex alignItems="center" justifyContent="center" marginRight="10px">
          <Image
            as={item.icon}
            width="25px"
            height="25px"
            sx={{
              borderRadius: '30%',
            }}
            alt={`Walleticon ${item.title}`}
          />
        </Flex>
        <Text variant="regular">{item.title}</Text>
      </StyledWallet>
      {!isWalletInstalled(item.connectorId) && (
        <StyledInstallButton type="button" onClick={() => openInNewTab(item.url)}>
          <Text variant="tiny" color="main">
            Install
          </Text>
        </StyledInstallButton>
      )}
    </Flex>
  )
}
