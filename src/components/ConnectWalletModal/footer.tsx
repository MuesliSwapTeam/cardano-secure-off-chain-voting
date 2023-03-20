import { ExternalLinkIcon } from 'assets/icons'
import { Flex, Text } from 'rebass/styled-components'

import { StyledFooterLink } from './styled'

export default function ModalFooter() {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p="10px 0"
      sx={{
        borderTopWidth: 1,
        borderTopStyle: 'solid',
        borderTopColor: 'secondary',
      }}
    >
      <Text variant="tiny" fontSize={['12px', '12px', '12px']}>
        New to Cardano?
      </Text>
      <Flex
        justifyContent="center"
        alignItems="center"
        color="text"
        sx={{
          '& svg': {
            height: 12,
            width: 12,
          },
        }}
      >
        <Text variant="tiny" mt="5px">
          <StyledFooterLink
            href="https://docs.muesliswap.com/cardano/cardano-wallets"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn about Cardano wallets
            <ExternalLinkIcon style={{ marginLeft: '6px' }} />
          </StyledFooterLink>
        </Text>
      </Flex>
    </Flex>
  )
}
