import styled, { css } from 'styled-components'

export const BUTTON_SIZE = 40
export const StyledPageSpace = styled.div`
  display: flex;
  margin: 5px;
  color: ${({ theme }) => theme.colors.text};
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;
  border: none;
  background-color: transparent;
`

export const StyledPageButton = styled.button<{ current?: boolean }>`
  margin-left: 5px;
  margin-right: 5px;
  width: ${BUTTON_SIZE}px;
  height: ${BUTTON_SIZE}px;
  border-radius: 8px;
  border: none;
  background-color: transparent;
  transition: 0.4s;

  :hover {
    background-color: ${({ theme }) => theme.colors.list};
    border-radius: 18px;
  }

  // for "current page":
  ${({ current }) =>
    current &&
    css`
      border-radius: 8px;
      background-color: ${({ theme }) => theme.colors.main};
      color: ${({ theme }) => theme.colors.primary};

      :hover {
        background-color: ${({ theme }) => theme.colors.mainPressed};
      }
    `}
`

export const StyledButton = styled.button<{ isPrev?: boolean }>`
  border: none;
  color: ${({ theme }) => theme.colors.main};
  width: 28px;
  height: 28px;
  background-color: transparent;
  border-radius: 2px;
  transition: 0.4s;

  :hover {
    background-color: ${({ theme }) => theme.colors.list};
    border-radius: 12px;
  }

  &:disabled {
    opacity: 0.3;
  }

  & svg {
    width: 14px;
    height: 12px;

    & path {
      fill: currentColor;
    }

    ${({ isPrev }) =>
      isPrev &&
      css`
        transform: rotate(180deg);
      `};
  }
`
