import styled from 'styled-components'

export const StyledAppearance = styled.div`
  margin-left: -25px;
  transform: rotate(0.5turn);
  pointer-events: none;
  color: ${({ theme }) => theme.colors.textSubtle};
`
export const StyledSelect = styled.select<{ small: boolean }>`
  height: ${({ small }) => (small ? '25px' : '40px')};
  width: 69px;
  position: relative;

  border: 1px solid ${({ theme }) => theme.colors.secondary};
  padding-right: 16px;
  border-radius: 12px;

  font-family: ${({ theme }) => theme.fonts.inter};
  font-size: 14px;
  letter-spacing: 0;
  line-height: 20px;
  text-align: center;

  color: ${({ theme }) => theme.colors.textSubtle};
  background-color: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  appearance: none;
`

export const StyledLabel = styled.label`
  position: relative;
`
