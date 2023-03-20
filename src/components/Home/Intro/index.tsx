import Bowl from 'components/Home/Intro/Bowl'
import { Flex, Text } from 'rebass/styled-components'

export default function Intro() {
  return (
    <Flex flexDirection={['column-reverse', 'row']} alignItems="center">
      <Flex flexDirection="column" width="100%" flexGrow="0.5">
        <Text as="p" variant="heading1">
          <Text as="span" color="main">
            Vote&nbsp;
          </Text>
          and&nbsp;
          <Text as="span" color="main">
            Discuss
          </Text>
          <br />
          &nbsp; on Cardano&apos;s leading DeFi ecosystem
        </Text>
      </Flex>
      <Bowl />
    </Flex>
  )
}
