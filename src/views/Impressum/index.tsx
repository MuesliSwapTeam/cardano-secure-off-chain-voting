import Page from 'components/common/Page'
import { Flex, Text } from 'rebass/styled-components'

export default function Impressum() {
  return (
    <Page title="Impressum">
      <Flex width="90%" flexDirection="column" marginX="auto">
        <Text variant="heading2" fontSize="25px">
          Impressum
        </Text>

        <Text variant="regular" mt="10px" fontSize="14px">
          OpenSwap Technologies AG <br />
          Baarerstrasse 43 6300 Zug Schweiz <br />
          Email: contact@openswap.tech <br />
          Company Name: OpenSwap Technologies AG <br />
          Registration number: CHE-415.691.389 <br />
          Vat number: CHE-415.691.389 MWST
        </Text>

        <Text variant="regular" mt="10px" fontSize="14px">
          <b> Contact Us</b> <br />
          <a href="https://docs.muesliswap.com/cardano/contact-us" target="_blank" rel="noopener noreferrer">
            Social Media Details
          </a>
          <p> Email: contact@muesliswap.com </p>
        </Text>

        <Text variant="regular" mt="15px" fontSize="14px">
          <b>Disclaimer</b> <br />
          The author assumes no liability for the correctness, accuracy, timeliness, reliability and completeness of the
          information. Liability claims against the author for material or immaterial damage resulting from access to,
          use or non-use of the published information, from misuse of the connection or from technical malfunctions are
          excluded. <br /> <br />
          All offers are non-binding. The author expressly reserves the right to change, add to, or delete parts of the
          pages or the entire offer without prior notice, or to temporarily or permanently cease publication.
          <br /> <br />
          <b> Disclaimer for content and links</b> <br />
          References and links to third party websites are outside our area of responsibility. It rejected any
          responsibility for such websites. Access to and use of such websites is at the user&apos;s own risk. <br />{' '}
          <br />
          <b>Copyright declaration </b> <br />
          The copyrights and all other rights to content, images, photos or other files on this website belong
          exclusively to OpenSwap Technologies AG or the specifically named rights holders. The written consent of the
          copyright holder must be obtained in advance for the reproduction of any elements. <br />
          Source:{' '}
          <a href="https://brainbox.swiss/" target="_blank" rel="noopener noreferrer">
            BrainBox Solutions
          </a>
        </Text>
      </Flex>
    </Page>
  )
}
