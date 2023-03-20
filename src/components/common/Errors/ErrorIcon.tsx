import { Icons } from 'react-toastify'
import { Box } from 'rebass/styled-components'

export default function Loader() {
  return (
    <Box sx={{ display: 'inline-block' }} width="80px" height="80px" mr="2px">
      {/* eslint-disable-next-line react/jsx-pascal-case */}
      <Icons.error theme="light" type="error" />
    </Box>
  )
}
