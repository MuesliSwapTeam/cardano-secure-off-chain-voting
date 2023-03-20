import { ArrowRight, EmptyBowlIcon } from 'assets/icons'
import Page from 'components/common/Page'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Flex, Heading, Text } from 'rebass/styled-components'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <Page>
      <Flex flexDirection="column" alignItems="center" justifyContent="center" width="100%" height="80vh">
        <Box as={EmptyBowlIcon} mb="6px" />
        <Heading variant="heading1">Error 404</Heading>
        <Text variant="heading5">Page not found.</Text>
        <Button mt="20px" onClick={() => navigate('/')}>
          <Box as={ArrowRight} sx={{ transform: 'rotate(180deg)' }} height="14px" />
          &nbsp; Back to home page
        </Button>
      </Flex>
    </Page>
  )
}
