import styled from 'styled-components'

const StyledLink = styled.a`
  display: flex;
  text-decoration: none;
  color: #5346ff;
  margin: 16px;

  & span {
    color: currentColor;
  }

  & svg {
    height: 16px;
    width: 16px;
    margin-left: 10px;
    path {
      fill: currentColor;
    }
  }
`

export default StyledLink
