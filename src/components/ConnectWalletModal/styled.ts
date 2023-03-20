import styled from 'styled-components'

export const StyledFooterLink = styled.a`
  margin-right: 5px;
  color: ${({ theme }) => theme.colors.main};
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

export const StyledWallet = styled.button`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  justify-content: start;
  align-items: center;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  padding: 15px;
  border-radius: 12px;
  width: 100%;
  transition: 0.4s;
  margin: 0 10px;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`

export const StyledInstallButton = styled.button`
  background-color: transparent;
  border: none;
  margin: 10px;
  color: ${({ theme }) => theme.colors.main};
`

export const StyledCloseButton = styled.button`
  border: none;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text};
`
