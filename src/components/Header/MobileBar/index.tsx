import { MenuIcon } from 'assets/icons'
import React from 'react'
import { Box, Button, Flex } from 'rebass/styled-components'

interface Props {
  toggleActive(): void
}

function MobileBar({ toggleActive }: Props) {
  return (
    <Flex as="nav" justifyContent="center" alignItems="center">
      <Button variant="text" color="text" maxHeight="40px" p="0px" ml="10px" onClick={toggleActive}>
        <Box as={MenuIcon} height={24} width={24} color="main" mr="8px" />
      </Button>
    </Flex>
  )
}

export default React.memo(MobileBar)
