import LazyLoad from 'react-lazy-load'
import { Image } from 'rebass/styled-components'
import styled from 'styled-components'

const StyledLogoWrapper = styled.div<{ width: string; height: string; marginRight: string; marginLeft?: string }>`
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  border-radius: 50%;
  margin-right: ${({ marginRight }) => marginRight};
  margin-left: ${({ marginLeft }) => marginLeft || '0px'};
  display: flex;
  align-items: center;
  justify-content: center;
`

export const PLACEHOLDER_IMAGE =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+vLjfwAJOgPAo99OowAAAABJRU5ErkJggg=='

const defaultOnError = ({ currentTarget }) => {
  // eslint-disable-next-line no-param-reassign
  currentTarget.onError = null
  // eslint-disable-next-line no-param-reassign
  currentTarget.src = PLACEHOLDER_IMAGE
}

// TODO pjordan: In the long term we should give the user here the option, to select his preference
function prepareImageURL(src: string) {
  if (!src) return PLACEHOLDER_IMAGE
  if (src.startsWith('ipfs://')) return src.replace('ipfs://', 'https://ipfs.io/ipfs/')
  if (src.startsWith('https://ada.muesliswap.com/'))
    return src.replace('https://ada.muesliswap.com/', 'https://static.muesliswap.com/')

  return src
}

export const DefaultLogo = styled.div`
  background: #ecf0f1;
  height: 32px;
  width: 32px;
  border-radius: 50%;
  margin: 0px;
  padding: 0px;
`

export function StyledLogo({
  src,
  size,
  marginRight,
  marginLeft,
}: {
  src: string
  size: string
  marginRight?: string
  marginLeft?: string
}) {
  return (
    <LazyLoad height={size} width={size} offset={40}>
      <StyledLogoWrapper width={size} height={size} marginRight={marginRight} marginLeft={marginLeft}>
        <Image
          src={prepareImageURL(src)}
          margin="auto"
          sx={{ borderRadius: '50%', overflow: 'hidden', objectFit: 'scale-down', objectPosition: 'center' }}
          onError={defaultOnError}
          crossOrigin="anonymous"
          alt={src}
        />
      </StyledLogoWrapper>
    </LazyLoad>
  )
}
StyledLogo.defaultProps = { marginRight: '10px', marginLeft: '0px' }

export function StyledLogoPair({ src0, src1, size }: { src0: string; src1: string; size: number }) {
  return (
    <LazyLoad height={size} width={2.35 * size + 10} offset={40}>
      <StyledLogoWrapper width={`${1.75 * size}px`} height={`${size}px`} marginRight="10px">
        <Image
          src={prepareImageURL(src0)}
          size={`${size}px`}
          sx={{ borderRadius: '50%', overflow: 'hidden', objectFit: 'scale-down', objectPosition: 'center' }}
          onError={defaultOnError}
          crossOrigin="anonymous"
          alt={src0}
        />
        <Image
          src={prepareImageURL(src1)}
          size={`${0.6 * size}px`}
          sx={{ borderRadius: '50%', overflow: 'hidden', objectFit: 'scale-down', objectPosition: 'center' }}
          onError={defaultOnError}
          crossOrigin="anonymous"
          alt={src1}
        />
      </StyledLogoWrapper>
    </LazyLoad>
  )
}
