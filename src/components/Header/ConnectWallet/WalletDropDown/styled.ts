import styled from 'styled-components'

export const StyledDropDownContainer = styled.div<{ active: boolean; isWide: boolean }>`
  display: ${({ active }) => (active ? 'block' : 'none')};
  position: absolute;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.primary};
  width: 270px;
  top: 55px;
  left: ${({ isWide }) => (isWide ? '-40%' : '-75%')};
  border-radius: 16px;
  box-shadow: ${({ theme }) => theme.shadows.tooltip};
  padding: 8px;
`

export const StyledCircle = styled.div`
  height: 25px;
  width: 25px;
  border-radius: 50%;
  background-color: gray;
  margin-right: 5px;
`
