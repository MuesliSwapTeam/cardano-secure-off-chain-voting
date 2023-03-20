import styled from 'styled-components'

export default styled.img<{
  height: string
  left: string
  top: string
}>`
  position: absolute;
  max-width: 100%;
  height: ${({ height }) => height};
  left: ${({ left }) => left};
  top: ${({ top }) => top};
`
