import styled from 'styled-components'

const RotateIconWrapper = styled.div<{ active: boolean; rotation?: number }>`
  transition: 200ms;
  transform: rotate(${({ active, rotation }) => (active ? '0deg' : rotation ? `${rotation}deg` : '180deg')});
`

export { RotateIconWrapper }
