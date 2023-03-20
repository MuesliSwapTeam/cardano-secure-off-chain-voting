import styled from 'styled-components'

export const StyledFooter = styled.footer`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: auto 10px 10px;
  padding: 25px 40px;
  border-radius: 16px;
  background-color: ${({ theme }) => theme.colors.primary};
  font-family: ${({ theme }) => theme.fonts.gilroy};
  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    margin: auto 16px 10px;
  }
`

export const StyledColumn = styled.div`
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 500;
`

export const StyledLink = styled.a<{ color?: string }>`
  text-decoration: none;
  font-family: ${({ theme }) => theme.fonts.inter};
  font-weight: normal;
  margin: 5px;
  font-size: 14px;
  color: ${({ theme, color }) => theme.colors[color] ?? theme.colors.main};
`
