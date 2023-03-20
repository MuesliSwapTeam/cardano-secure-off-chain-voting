import { HEADER_HEIGHT, HEADER_PADDING } from 'components/Header'
import { Box, Flex, Text } from 'rebass/styled-components'

import SmallLoadingIcon from './SmallLoadingIcon'

export default function LoadingHint({ text }: { text?: string }) {
  return (
    <Box
      bg={text ? 'primary' : undefined}
      padding="4px"
      pr="8px"
      sx={{
        zIndex: 5,
        opacity: '70%',
        position: 'fixed',
        top: HEADER_HEIGHT + 2 * HEADER_PADDING,
        left: `calc(100% - ${HEADER_PADDING}px)`,
        transform: 'translate(-100%, -50%)',
        msTransform: 'translate(-100%, -50%)',
        borderRadius: '10px',
      }}
    >
      <Flex>
        {text ? <Text variant="subtle">{text}</Text> : undefined}
        <SmallLoadingIcon />
      </Flex>
    </Box>
  )
}

LoadingHint.defaultProps = { text: undefined }
