import { CloseIcon, ExternalLinkIcon } from 'assets/icons'
import LINKS from 'components/Header/links'
import LinkItem from 'components/Header/MobileBar/LinkItem'
import {
  StyledLinkWrapper,
  StyledNavLink,
  StyledScrollWrapper,
  StyledSidebar,
} from 'components/Header/MobileBar/styled'
import ThemeSwitcher from 'components/Header/ThemeSwitcher'
import MuesliLogo from 'components/MuesliLogo'
import React from 'react'
import { NavLink } from 'react-router-dom'
import { Button, Flex } from 'rebass/styled-components'

import NewTag from '../NewTag'

interface Props {
  top: number
  active: boolean
  toggleActive(): void
}

export default function MobileSidebar({ top, active, toggleActive }: Props) {
  return (
    <StyledSidebar active={active} $top={top}>
      <Flex flexDirection="row" alignItems="center" width="100%" p="16px">
        <NavLink to="/" onClick={toggleActive}>
          <MuesliLogo />
        </NavLink>
        <Button variant="icon-transparent" ml="auto" color="main" onClick={toggleActive}>
          <CloseIcon />
        </Button>
      </Flex>
      <StyledLinkWrapper>
        <StyledScrollWrapper>
          {LINKS.map((link) => (
            <React.Fragment key={link.id}>
              {'routes' in link ? (
                <LinkItem link={link} onToggle={toggleActive} />
              ) : (
                <StyledNavLink
                  key={link.id}
                  as={link.external ? 'a' : NavLink}
                  to={!link.external ? link.to : null}
                  href={link.external ? (link.to as string) : null}
                  target={link.external ? '_blank' : null}
                >
                  {link.name}
                  {link.external && (
                    <>
                      &nbsp;
                      <ExternalLinkIcon />
                    </>
                  )}
                  {link.new && <NewTag />}
                </StyledNavLink>
              )}
            </React.Fragment>
          ))}
        </StyledScrollWrapper>
        <Flex flexDirection="row" width="100%" justifyContent="center">
          <ThemeSwitcher />
        </Flex>
      </StyledLinkWrapper>
    </StyledSidebar>
  )
}
