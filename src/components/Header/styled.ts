import styled from 'styled-components'

export const DropdownButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  border-radius: 12px;
  padding: 10px;
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.gilroy};
  font-weight: 500;
  font-size: 15px;
`
export const VerticalDivider = styled.div`
  height: 56px;
  margin: 0 15px;
  border-left: 1px solid ${({ theme }) => (theme.isDark ? theme.colors.grey800 : theme.colors.grey300)};
  border-right: 1px solid ${({ theme }) => (theme.isDark ? '#070E1D' : '#ffffff')};
`
