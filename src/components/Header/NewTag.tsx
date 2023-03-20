import { Box } from 'rebass/styled-components'

export default function NewTag() {
  return (
    <Box
      as="span"
      color="main"
      variant="tiny"
      sx={{
        fontSize: 12,
        p: '1px 4px',
        bg: '#dfddff',
        m: '3px',
        borderRadius: '4px',
      }}
    >
      NEW
    </Box>
  )
}
