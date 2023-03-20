import IMAGES, { Bowl as BowlImage, MatrixDark, MatrixLight } from 'assets/images/landing'
import { Background, Hex, Triangle } from 'assets/images/landing/icons'
import StyledCoin from 'components/Home/Intro/StyledCoin'
import { Box, Flex } from 'rebass/styled-components'
import { useTheme } from 'styled-components'

export default function Bowl() {
  const theme = useTheme()
  return (
    <Flex
      // flexGrow="0.5"
      maxWidth="544px"
      m="40px auto"
      sx={{
        position: 'relative',
        width: '100%',
        // don't specify height - set by scaling background image!
        '@media (max-width: 750px)': {
          marginBottom: '24px',
          width: '75%',
        },
      }}
    >
      <Box color={theme.isDark ? '#ffffff14' : '#ffffff'} style={{ width: '100%' }}>
        <Background />
      </Box>
      {theme.isDark ? (
        <MatrixDark
          style={{
            position: 'absolute',
            width: '80%',
            bottom: '9%',
            left: '5%',
          }}
        />
      ) : (
        <MatrixLight
          style={{
            position: 'absolute',
            width: '80%',
            bottom: '9%',
            left: '5%',
          }}
        />
      )}

      <BowlImage
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '25%',
          width: '45%',
          color: theme.isDark ? '#0C1629' : '#DDE2F8',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          left: '-15px',
          top: '30%',
          width: '5%',
          color: '#FFD153',
        }}
      >
        <Triangle />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          width: '5%',
          right: '12%',
          bottom: 106,
          color: '#3856E8',
          transform: 'rotate(180deg)',
        }}
      >
        <Triangle />
      </Box>
      <Box
        sx={{
          position: 'absolute',
          width: '5%',
          left: 60,
          bottom: 0,
          color: '#A1B1FF',
        }}
      >
        <Hex />
      </Box>
      <StyledCoin height="21%" left="5%" top="30%" src={IMAGES.coinOne.src} alt={IMAGES.coinOne.name} />
      <StyledCoin height="24%" left="21%" top="-5%" src={IMAGES.coinTwo.src} alt={IMAGES.coinTwo.name} />
      <StyledCoin height="20%" left="50%" top="-15%" src={IMAGES.coinThree.src} alt={IMAGES.coinThree.name} />
      <StyledCoin height="24%" left="57%" top="15%" src={IMAGES.coinFour.src} alt={IMAGES.coinFour.name} />
    </Flex>
  )
}
