import { Flex } from 'rebass/styled-components'

import Loader from './LoadingIcon'

export default function LoadingContainer(props) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <Flex alignItems="center" justifyContent="center" {...props}>
      <Loader />
    </Flex>
  )
}
