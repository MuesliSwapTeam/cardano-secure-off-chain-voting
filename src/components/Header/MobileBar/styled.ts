import styled, { css } from 'styled-components'

const mediaQuery = css`
  @media (min-width: 969px) {
    display: none;
  }
`

export const StyledLinkWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
`

export const StyledScrollWrapper = styled.nav`
  width: 100%;
  overflow: auto;
`

export const StyledNavItem = styled.div`
  margin: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.4s;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  line-height: 24px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.gilroy};
  font-weight: 600;
  background: transparent;
  border: none;
`

export const StyledSidebar = styled.div<{ active: boolean; $top: number }>`
  position: fixed;
  top: ${({ $top }) => $top}px;
  left: ${({ active }) => (active ? '4.5%' : '-100%')};
  right: ${({ active }) => (active ? '4.5%' : '120%')};
  bottom: 10px;
  //width: 90%;

  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.primary};
  overflow: hidden;
  transition: 0.4s;
  z-index: 5;

  ${mediaQuery};
`

export const StyledNavLink = styled.a`
  display: flex;
  justify-content: start;
  align-items: center;
  transition: 0.4s;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  line-height: 24px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.gilroy};
  font-weight: 600;
  height: 48px;
  background: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => (theme.isDark ? theme.colors.grey700 : theme.colors.grey200)};
  border-radius: 12px;
  margin-bottom: 16px;
  padding: 0 16px;

  &:hover {
    color: ${({ theme }) => theme.colors.main};
  }

  &.active {
    color: ${({ theme }) => theme.colors.main};
  }
`
