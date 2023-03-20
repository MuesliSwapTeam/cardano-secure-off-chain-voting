import { Box } from 'rebass'

import Loader from './LoadingIcon'

export default function LoadingScreen() {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        msTransform: 'translate(-50%, -50%)',
      }}
    >
      <Loader />
    </Box>
  )
}
