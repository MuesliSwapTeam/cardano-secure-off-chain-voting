import styled from 'styled-components'

export default styled.main`
  padding: 0 10px;
  margin: 0 16px;
  min-height: 90vh; // this ensures half of footer doesn't pop up

  @media (min-width: ${({ theme }) => theme.breakpoints[0]}) {
    padding: 0 16px;
    margin: 0 80px;
  }

  @media (min-width: 1550px) {
    max-width: 1352px;
    margin: 0 auto;
  }
`
