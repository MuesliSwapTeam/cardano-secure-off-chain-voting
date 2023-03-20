import { PropsWithChildren } from 'react'
import { Box, Flex } from 'rebass/styled-components'
import { useTheme } from 'styled-components'

import Error from './ErrorIcon'

export default function ErrorScreen({ children }: PropsWithChildren) {
  const theme = useTheme()

  return (
    <Box
      sx={{
        position: 'fixed',
        backdropFilter: 'blur(4px)',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: `${theme.colors.text}66`,
        zIndex: 100,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          backgroundColor: 'primary',
          borderRadius: '12px',
          padding: '20px',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          msTransform: 'translate(-50%, -50%)',
        }}
      >
        <Flex justifyContent="row" justifyItems="center" alignItems="center">
          <Box mr="20px">
            <Error />
          </Box>
          {children}
        </Flex>
      </Box>
    </Box>
  )
}
