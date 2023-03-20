import styled from 'styled-components'

export const StyledTableFooter = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  height: 88px;
  width: 100%;

  padding: 0 24px;
  border-top: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: 0 0 16px 16px;

  background-color: ${({ theme }) => theme.colors.primary64};
  box-sizing: border-box;

  @media (max-width: 525px) {
    height: fit-content;
    flex-direction: column-reverse;
    padding: 16px 0;
  }
`
