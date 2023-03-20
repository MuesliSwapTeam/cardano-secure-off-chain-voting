import { ArrowUp, ExternalLinkIcon } from 'assets/icons'
import { LinkType, RouteType } from 'components/Header/types'
import useMatchPaths from 'hooks/useMatchPaths'
import { useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { useClickAway, useToggle } from 'react-use'
import { Box } from 'rebass/styled-components'

import { StyledNavItem, StyledNavLink } from './styled'

interface Props {
  link: LinkType & Required<{ routes: RouteType[] }>
}

export default function LinkItem({ link }: Props) {
  const [toggle, setToggle] = useToggle(false)
  const dropDownRef = useRef(null)
  const matched = useMatchPaths({ routes: link.routes })

  useClickAway(dropDownRef, () => setToggle(false))

  return (
    <Box sx={{ position: 'relative' }}>
      <StyledNavItem className={matched ? 'active' : undefined} as="button" role="button" onClick={setToggle}>
        {link.name}
        <Box
          mt={!toggle ? '2px' : '-4px'}
          ml="4px"
          sx={{
            transform: `rotate(${toggle ? '0' : '180deg'})`,
          }}
        >
          <ArrowUp />
        </Box>
      </StyledNavItem>

      <Box
        display={toggle ? 'flex' : 'none'}
        bg="primary"
        p="10px"
        flexDirection="column"
        justifyContent="center"
        alignItems="flex-start"
        ref={dropDownRef}
        sx={{
          position: 'absolute',
          top: '48px',
          left: '50%',
          borderRadius: '5px',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          zIndex: 2,
        }}
      >
        {link.routes.map((route) => (
          <StyledNavLink
            key={route.id}
            as={route.external ? 'a' : NavLink}
            to={!route.external ? route.to : null}
            href={route.external ? (route.to as string) : null}
            target={link.external ? '_blank' : null}
            onClick={setToggle}
          >
            {route.name}
            {route.external && (
              <>
                &nbsp;
                <ExternalLinkIcon />
              </>
            )}
          </StyledNavLink>
        ))}
      </Box>
    </Box>
  )
}
