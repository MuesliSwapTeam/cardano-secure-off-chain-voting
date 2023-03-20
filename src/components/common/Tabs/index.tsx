import { Box } from 'rebass/styled-components'

// TODO(mzilinec): would be nice to have the entire tab div as a component but whatever
// just use this with a grid like in TabNavigation/index.tsx

export function TabUnderline({ idx, currentIdx, isSmall }) {
  return (
    <Box
      as="span"
      sx={{
        left: isSmall ? '16px' : '24px',
        height: '4px',
        marginTop: '-4px',
        bg: idx === currentIdx ? 'main' : 'transparent',
        transform: `translate3d(${(currentIdx - idx) * 100}%, 0, 0)`,
        borderRadius: '8px',
        transition: '0.25s',
        gridRow: 2,
        gridColumn: idx + 1,
        alignSelf: 'stretch',
        marginX: '10px',
      }}
    />
  )
}
