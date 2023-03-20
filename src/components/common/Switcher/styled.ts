import styled from 'styled-components'

export const StyledInput = styled.input`
  position: absolute;
  height: 1px;
  width: 1px;
  clip: rect(0 0 0 0);
  overflow: hidden;
`

export const StyledSlider = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 15px;
  transition: 0.25s;

  &:before {
    content: '';

    position: absolute;
    left: 2px;
    bottom: 2px;

    width: 16px;
    height: 16px;
    border-radius: 100%;

    background-color: white;

    transition: 0.25s;
  }
`

export const StyledSwitch = styled.label<{ margin?: string }>`
  position: relative;
  display: inline-block;
  width: 34px;
  height: 20px;
  background-color: ${({ theme }) => theme.colors.secondary};
  border-radius: 15px;
  margin: ${({ margin }) => margin};

  &:focus-within {
    box-shadow: 0 0 5px 0 ${({ theme }) => theme.colors.main};
  }

  ${StyledInput}:checked + ${StyledSlider}:before {
    transform: translateX(14px);
  }

  ${StyledInput}:checked + ${StyledSlider} {
    background-color: ${({ theme }) => theme.colors.main};
  }
`
