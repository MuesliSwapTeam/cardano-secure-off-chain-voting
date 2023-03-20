import styled, { keyframes } from 'styled-components'

const loaderAnimation = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`

export const LoaderWrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
`

export const LoaderItem = styled.div`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border-width: 8px;
  border-style: solid;
  border-radius: 50%;
  animation: ${loaderAnimation} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: ${({ theme }) => theme.colors.main} transparent transparent transparent;

  &:nth-child(1) {
    animation-delay: -0.45s;
  }

  &:nth-child(2) {
    animation-delay: -0.3s;
  }
  &:nth-child(3) {
    animation-delay: -0.15s;
  }
`

export const SmallLoaderWrapper = styled.div`
  display: inline-block;
  position: relative;
  width: 20px;
  height: 20px;
`

export const SmallLoaderItem = styled.div`
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 20px;
  height: 20px;
  margin: 2px;
  border-width: 4px;
  border-style: solid;
  border-radius: 50%;
  animation: ${loaderAnimation} 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: ${({ theme }) => theme.colors.main} transparent transparent transparent;

  &:nth-child(1) {
    animation-delay: -0.45s;
  }

  &:nth-child(2) {
    animation-delay: -0.3s;
  }
  &:nth-child(3) {
    animation-delay: -0.15s;
  }
`
