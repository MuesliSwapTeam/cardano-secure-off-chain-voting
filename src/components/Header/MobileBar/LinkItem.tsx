import { ArrowUp, ExternalLinkIcon } from 'assets/icons'
import { LinkType, RouteType } from 'components/Header/types'
import useMatchPaths from 'hooks/useMatchPaths'
import { NavLink } from 'react-router-dom'
import { useToggle } from 'react-use'
import { Box, Flex } from 'rebass/styled-components'
import { useTheme } from 'styled-components'

import NewTag from '../NewTag'
import { StyledNavItem, StyledNavLink } from './styled'

interface Props {
  link: LinkType & Required<{ routes: RouteType[] }>
  onToggle: () => void
}

export default function LinkItem({ link, onToggle }: Props) {
  const [toggle, setToggle] = useToggle(false)
  const matched = useMatchPaths({ routes: link.routes })
  const { isDark } = useTheme()

  return (
    <Box>
      <Flex
        width="100%"
        sx={{
          position: 'relative',
          height: '48px',
          bg: 'primary',
          marginBottom: '16px',
          cursor: 'pointer',
          border: '1px solid',
          borderColor: isDark ? 'grey700' : 'grey200',
          borderRadius: '12px',
          color: 'text',
          '&:hover button, &:hover div': {
            color: 'main',
          },
        }}
        onClick={setToggle}
      >
        <StyledNavItem className={matched ? 'active' : undefined} as="button" role="button">
          {link.name}
        </StyledNavItem>

        <Box
          sx={{
            position: 'absolute',
            right: '15px',
            top: toggle ? '10px' : '15px',
            transform: `rotate(${toggle ? '0' : '180deg'})`,
          }}
        >
          <ArrowUp />
        </Box>
      </Flex>

      <Box
        flexDirection="column"
        alignItems="stretch"
        justifyContent="center"
        p="0 10px"
        display={toggle ? 'flex' : 'none'}
      >
        {link.routes.map((route) => (
          <StyledNavLink
            key={route.id}
            as={route.external ? 'a' : NavLink}
            to={!route.external ? route.to : null}
            href={route.external ? (route.to as string) : null}
            target={route.external ? '_blank' : null}
            onClick={onToggle}
          >
            {route.name}
            {route.external && (
              <>
                &nbsp;
                <ExternalLinkIcon />
              </>
            )}
            {route.new && <NewTag />}
          </StyledNavLink>
        ))}
      </Box>
    </Box>
  )
}
