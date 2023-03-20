import styled from 'styled-components'

// eslint-disable-next-line import/prefer-default-export
export const HorizontalDivider = styled.div`
  border-top: 1px solid ${({ theme }) => (theme.isDark ? '#0000004b' : '#29315f1e')};
  border-bottom: 1px solid ${({ theme }) => (theme.isDark ? '#cfd6e419' : '#ffffff')};
`
