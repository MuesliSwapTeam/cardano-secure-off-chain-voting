import { ExternalLinkIcon } from 'assets/icons'
import { VerticalDivider } from 'components/Header/styled'
import { LinkType } from 'components/Header/types'
import MuesliLogo from 'components/MuesliLogo'
import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Flex } from 'rebass/styled-components'

import NewTag from '../NewTag'
import LinkItem from './LinkItem'
import { StyledNavItem, StyledNavLink } from './styled'

interface Props {
  // eslint-disable-next-line react/no-unused-prop-types
  links: LinkType[]
}

function DesktopBar({ links }: Props) {
  return (
    <>
      <StyledNavItem as={Link} to="/" aria-label="Go to Home">
        <MuesliLogo />
      </StyledNavItem>

      <VerticalDivider />

      {links.map((item) =>
        'routes' in item ? (
          <LinkItem key={item.id} link={item} />
        ) : (
          <StyledNavLink
            key={item.id}
            as={item.external ? 'a' : NavLink}
            to={!item.external ? item.to : null}
            href={item.external ? (item.to as string) : null}
            target={item.external ? '_blank' : null}
          >
            {item.name}
            {item.external && (
              <>
                &nbsp;
                <ExternalLinkIcon />
              </>
            )}
            {item.new && <NewTag />}
          </StyledNavLink>
        ),
      )}
    </>
  )
}

export default React.memo(
  React.forwardRef(({ links }: Props, ref) => (
    <Flex as="nav" alignItems="center" width="max-content" ref={ref}>
      <DesktopBar links={links} />
    </Flex>
  )),
)
