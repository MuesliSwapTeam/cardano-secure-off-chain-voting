import { Text } from 'rebass/styled-components'

import { ErrorPopover } from '.'

export default function GeneralError() {
  return (
    <ErrorPopover>
      <Text variant="subheading">
        Our backend services are currently unavailable, <br /> please try again in a few minutes
      </Text>
    </ErrorPopover>
  )
}
