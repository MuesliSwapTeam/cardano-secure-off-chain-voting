import styled from 'styled-components'

export const StyledNavLink = styled.a`
  margin: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.4s;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 16px;
  line-height: 24px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.gilroy};
  font-weight: 600;
  &:hover {
    color: ${({ theme }) => theme.colors.main};
  }
  &.active {
    color: ${({ theme }) => theme.colors.main};
  }
`

export const StyledNavItem = styled.div`
  margin: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.4s;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.textSubtle};
  font-size: 16px;
  line-height: 24px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.gilroy};
  font-weight: 600;
  background: transparent;
  border: none;
  &:hover {
    color: ${({ theme }) => theme.colors.main};
  }
  &.active {
    color: ${({ theme }) => theme.colors.main};
  }

  & svg {
    stroke: currentColor;
  }
`
