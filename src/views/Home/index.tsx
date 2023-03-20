import Page from 'components/common/Page'
import ConnectWallet from 'components/Home/ConnectWallet'
import Intro from 'components/Home/Intro'
import { Box } from 'rebass/styled-components'

export default function Home() {
  return (
    <Page>
      <Box pt="20px">
        <Intro />
        <ConnectWallet />
      </Box>
    </Page>
  )
}
