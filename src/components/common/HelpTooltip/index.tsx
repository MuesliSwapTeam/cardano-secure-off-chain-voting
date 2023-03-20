/* eslint-disable react/jsx-props-no-spreading */
import { QuestionIcon } from 'assets/icons'
import { PropsWithChildren } from 'react'
import { useHover } from 'react-use'
import { Box, BoxProps } from 'rebass/styled-components'
import { useTheme } from 'styled-components'

export default function HelpTooltip({ size, children, ...props }: BoxProps | PropsWithChildren<{ size: number }>) {
  const theme = useTheme()
  const [hoverBox, isHover] = useHover(
    <Box
      as={QuestionIcon}
      color="grey500"
      sx={{
        height: size,
        width: size,
        cursor: 'pointer',
      }}
    />,
  )
  const [contentBox, isContentHover] = useHover(
    <Box
      maxWidth="260px"
      bg="primary"
      padding="8px"
      sx={{
        position: 'absolute',
        transform: `translate(${Number(size) - 30}px, -100%)`,
        borderRadius: 12,
        /* TODO: Do we really want this shadow? */
        filter: `drop-shadow(2px -2px 5px ${theme.colors.grey})`,
        zIndex: 200,
      }}
    >
      {children}
    </Box>,
  )

  return (
    <Box display="inline-flex" alignContent="center" justifyContent="center" height={size} width={size} {...props}>
      <Box display={isHover || isContentHover ? 'inherit' : 'none'}>{contentBox}</Box>
      {hoverBox}
    </Box>
  )
}
