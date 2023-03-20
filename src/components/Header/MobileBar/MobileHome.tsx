import MuesliIcon from 'components/MuesliIcon'
import { Link } from 'react-router-dom'
import { Flex } from 'rebass/styled-components'

import { VerticalDivider } from '../styled'

export default function MobileHome() {
  return (
    <Flex flexDirection="row" justifyContent="start" flexGrow="1" style={{ margin: '-8px 0' }}>
      <Link to="/">
        <MuesliIcon />
      </Link>
      <VerticalDivider style={{ margin: '-8px 15px' }} />
    </Flex>
  )
}
