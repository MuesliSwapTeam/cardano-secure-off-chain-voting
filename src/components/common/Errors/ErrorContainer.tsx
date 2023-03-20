/* eslint-disable react/destructuring-assignment */
import { PropsWithChildren } from 'react'
import { Box, Flex } from 'rebass/styled-components'

import Error from './ErrorIcon'

export default function ErrorContainer(props: PropsWithChildren) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Flex flexDirection="row" alignItems="center" justifyContent="center" {...props}>
      <Box mr="20px">
        <Error />
      </Box>
      {props.children}
    </Flex>
  )
}
