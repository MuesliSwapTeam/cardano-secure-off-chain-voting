import { ChevronRight, ExternalLinkIcon } from 'assets/icons'
import IMAGES from 'assets/images/landing'
import { Hex, Rhombus, Triangle } from 'assets/images/landing/icons'
import ConnectWalletModal from 'components/ConnectWalletModal'
import { useWallet } from 'hooks/useWallet'
import { useToggle } from 'react-use'
import { Box, Button, Flex, Image, Text } from 'rebass/styled-components'

export default function ConnectWallet() {
  const [showConnectModal, toggleConnectModal] = useToggle(false)
  const { isWalletEnabled } = useWallet()

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      width="100%"
      m="44px -16px"
      p="90px 0 53px 0"
      textAlign="center"
      sx={{ position: 'relative' }}
    >
      <Text as="h2" variant="heading2" margin="16px">
        Start voting today
      </Text>
      <Text as="p" margin="16px">
        Connect your Cardano wallet and start using all our features.
      </Text>
      <ConnectWalletModal toggleModal={showConnectModal} setToggleModal={toggleConnectModal} />
      <Flex alignItems="center" justifyContent="center" m="16px">
        <Button variant="primary-l" onClick={toggleConnectModal} disabled={isWalletEnabled}>
          Connect Wallet
          <ChevronRight />
        </Button>

        <Button
          as="a"
          variant="text-l"
          ml="16px"
          href="https://docs.muesliswap.com/cardano/cardano-wallets"
          target="_blank"
          rel="noreferrer noopener"
        >
          Learn how to start
          <ExternalLinkIcon />
        </Button>
      </Flex>
      <Image
        height={['82px', '171px']}
        width="auto"
        src={IMAGES.coinTwo.src}
        alt="backgroundCoin2"
        sx={{ position: 'absolute', top: 0, right: 0, zIndex: '-1' }}
      />
      <Image
        height={['65px', '138px']}
        width="auto"
        alt="backgroundCoin4"
        src={IMAGES.coinFour.src}
        sx={{ position: 'absolute', bottom: 0, left: 0, transform: 'rotate(-19deg)', zIndex: '-1' }}
      />
      <Image
        height={['40px', '84px']}
        width="81px"
        alt="backgroundCoin3"
        src={IMAGES.coinThree.src}
        sx={{ position: 'absolute', top: '30px', left: '-30px', zIndex: '-1' }}
      />
      <Box
        height="28px"
        width="28px"
        color="#F79D04"
        sx={{ position: 'absolute', top: '0', left: '200px', zIndex: '-1' }}
      >
        <Triangle />
      </Box>
      <Box
        height="39px"
        width="38px"
        color="#7C8FFF"
        sx={{ position: 'absolute', top: '20px', right: '170px', transform: 'rotate(180deg)', zIndex: '-1' }}
      >
        <Triangle />
      </Box>
      <Box
        height="21px"
        width="21px"
        color="#F79D04"
        sx={{ position: 'absolute', top: '230px', right: '20px', zIndex: '-1' }}
      >
        <Rhombus />
      </Box>
      <Box
        height="21px"
        width="21px"
        color="#F56481"
        sx={{ position: 'absolute', top: '185px', left: '100px', zIndex: '-1' }}
      >
        <Hex />
      </Box>
    </Flex>
  )
}
