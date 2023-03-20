import { ArrowUp, ExternalLinkIcon, WalletIcon } from 'assets/icons'
import { RotateIconWrapper } from 'components/common'
import { DropdownButton } from 'components/Header/styled'
import SelectAdaHandleModal from 'components/SelectAdaHandleModal'
import { CONNECTOR_CONFIGURATIONS } from 'config/walletConnectors'
import useDisplayAddress from 'hooks/useDisplayAddress'
import { useWallet } from 'hooks/useWallet'
import { useMemo, useRef } from 'react'
import { useClickAway, useToggle } from 'react-use'
import { Box, Button, Flex, Image, Text } from 'rebass/styled-components'
import { useWalletConnector } from 'state/user/hooks'
import { useTheme } from 'styled-components'
import { isMainnet } from 'utils/networkId'
import { formatNumber } from 'utils/numericHelpers'

import { StyledDropDownContainer } from './styled'

interface Props {
  disconnect: () => void
  isWide: boolean
}

export default function WalletDropDown({ disconnect, isWide }: Props) {
  const theme = useTheme()
  const { useBalance, useAdaHandles } = useWallet()
  const displayAddress = useDisplayAddress()
  const balance = useBalance()
  const walletConnectorKey = useWalletConnector()
  const walletConnector = useMemo(() => CONNECTOR_CONFIGURATIONS[walletConnectorKey], [walletConnectorKey])
  const [toggle, setToggle] = useToggle(false)
  const dropDownRef = useRef(null)

  const handles = useAdaHandles()
  const [showSelectHandle, toggleShowAdaHandle] = useToggle(false)
  useClickAway(dropDownRef, () => setToggle(false))

  return (
    <>
      <SelectAdaHandleModal isOpen={showSelectHandle} toggleModal={toggleShowAdaHandle} />
      <Box m="8px" sx={{ position: 'relative' }} ref={dropDownRef}>
        <DropdownButton type="button" onClick={setToggle}>
          <WalletIcon style={{ color: theme.colors.main }} />
          <Box marginX="5px">
            {displayAddress.isAdaHandle && (
              <Text as="span" color="green">
                $
              </Text>
            )}
            {displayAddress.text}
          </Box>
          <RotateIconWrapper active={toggle}>
            <ArrowUp />
          </RotateIconWrapper>
        </DropdownButton>

        <StyledDropDownContainer active={toggle} isWide={isWide}>
          <Flex justifyContent="space-between" alignItems="center" p="8px">
            <Text variant="tiny">Connected with</Text>
            <Flex justifyContent="center" alignItems="center">
              <Flex alignItems="center" justifyContent="center">
                <Image
                  as={walletConnector.icon}
                  width="25px"
                  height="25px"
                  alt={`${walletConnector.title}-icon`}
                  sx={{
                    borderRadius: '50%',
                    marginRight: '10px',
                  }}
                />
              </Flex>
              <Text variant="tiny" fontWeight="500">
                {walletConnector.title}
              </Text>
            </Flex>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" p="8px">
            <Text variant="tiny">Network</Text>
            <Text variant="tiny" fontWeight="500">
              <Box
                display="inline-block"
                mr="4px"
                size="8px"
                backgroundColor={isMainnet() ? theme.colors.main : theme.colors.violet500}
                sx={{ borderRadius: '50%' }}
              />
              {isMainnet() ? 'Mainnet' : 'Testnet'}
            </Text>
          </Flex>
          <Flex justifyContent="space-between" alignItems="center" p="8px" mb="4px">
            <Text variant="tiny">Balance</Text>
            <Text variant="tiny" fontWeight="500">
              {balance ? `${formatNumber(balance, 2)} ₳` : '-'}
            </Text>
          </Flex>
          <Flex
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p="12px 8px 0 8px"
            sx={{ borderTop: '1px solid #eeeeee' }}
          >
            {/* TODO pjordan: This should move in a settings dialog */}
            {handles?.length > 0 && (
              <Button height="32px" width="100%" mb="8px" onClick={toggleShowAdaHandle}>
                Select&nbsp;
                <Text as="span" color="#0CD15B">
                  $
                </Text>
                handle
              </Button>
            )}
            <Button width="100%" mb="16px" onClick={disconnect}>
              Disconnect
            </Button>
            <Button
              variant="text"
              as="a"
              href="https://docs.muesliswap.com/cardano/cardano-wallets#4.-disconnecting"
              target="_blank"
              rel="noopener noreferrer"
            >
              How to fully disconnect
              <ExternalLinkIcon />
            </Button>
          </Flex>
        </StyledDropDownContainer>
      </Box>
    </>
  )
}
