import styled from 'styled-components'

export const HiddenInput = styled.input`
  position: absolute;
  height: 1px;
  width: 1px;
  clip: rect(0 0 0 0);
  overflow: hidden;
`

export const Badge = styled.div`
  position: absolute;
  left: 4px;
  height: 24px;
  width: 24px;
  border-radius: 24px;
  transition: 0.25s;
  background-color: ${({ theme }) => theme.colors.primary};
  box-shadow: ${({ theme }) => theme.shadows.tooltip};
`

export const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  z-index: 1;
  height: 24px;
  box-sizing: border-box;
  transition: 0.25s;
  color: ${({ theme }) => theme.colors.grey500};
`

export const ThemeSwitcherLabel = styled.label`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  margin: 8px;
  border-radius: 16px;
  box-sizing: border-box;
  cursor: pointer;
  position: relative;
  background-color: ${({ theme }) => theme.colors.secondary};

  // DO NOT HAVE ANY ON FOCUS STATES IN DESIGN
  &:focus-within {
    box-shadow: 0 0 5px 0 ${({ theme }) => theme.colors.main};
  }

  & ${HiddenInput}:checked + ${Badge} {
    transform: translateX(24px);
    background-color: ${({ theme }) => theme.colors.main};
  }

  & ${HiddenInput}:checked + * + ${IconWrapper} + ${IconWrapper} {
    color: ${({ theme }) => theme.colors.text};
  }

  & ${HiddenInput}:not(:checked) + * + ${IconWrapper} {
    color: ${({ theme }) => theme.colors.main};
  }
`
