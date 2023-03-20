import styled from 'styled-components'

export const StyledAppearance = styled.div`
  position: absolute;
  display: inline-flex;
  right: 15px;
  top: 50%;
  transform: translate(0, -50%) rotate(0.5turn);
`

export const StyledSelect = styled.select`
  height: 40px;
  width: 69px;
  position: relative;

  margin-left: 12px;
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
