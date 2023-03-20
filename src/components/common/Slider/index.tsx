import { Box, Flex, Text } from 'rebass/styled-components'
import styled from 'styled-components'
import { formatNumberFixed } from 'utils/numericHelpers'

const Styled = styled.div`
  width: 100%;
  position: relative;
  align-items: center;

  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    display: block;
    margin-bottom: 8px;
    width: 100%;
    cursor: pointer;
    height: 6px;
    border-radius: 20px;
    background: ${({ theme }) => theme.colors.secondary};
    background-image: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.blue300} 0%,
      ${({ theme }) => theme.colors.main} 100%
    );
    background-repeat: no-repeat;
  }

  // !!!
  // Note: Generally, if there is an invalid pseudo-element or pseudo-class within in a chain or group of selectors,
  // the whole selector list is invalid. If a pseudo-element (but not pseudo-class) has a -webkit- prefix,
  // As of Firefox 63, Blink, WebKit and Gecko browsers assume it is valid, not invalidating the selector list.

  input[type='range']::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    appearance: none;
    box-shadow: none;
    border: none;
    background: transparent;
  }

  input[type='range']::-moz-range-progress {
    width: 100%;
    height: 6px;
    background: linear-gradient(
      90deg,
      ${({ theme }) => theme.colors.blue300} 0%,
      ${({ theme }) => theme.colors.main} 100%
    );
    border-radius: 20px;
  }

  input[type='range']::-moz-range-track {
    width: 100%;
    height: 2px;
    background: ${({ theme }) => theme.colors.secondary};
  }

  input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    height: 26px;
    width: 26px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    border: 2px solid ${({ theme }) => theme.colors.main};
  }

  input[type='range']::-moz-range-thumb {
    height: 26px;
    width: 26px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    border: 2px solid ${({ theme }) => theme.colors.main};
  }
`

const Indicator = styled.div<{ left }>`
  margin-bottom: 20px;
  position: relative;
  background: ${({ theme }) => theme.colors.main};
  width: 48px;
  height: 48px;
  border-radius: 18px;
  text-align: center;
  line-height: 48px;
  left: ${({ left }) => left};
`

function Slider({ value, setValue }) {
  const offsetPx = 48 * (value / 100)
  const indicatorOffset = `calc(${value}% - ${offsetPx}px)`

  const getBackgroundSize = () => ({ backgroundSize: `${value}% 100%` })

  return (
    <Box>
      <Flex alignItems="center" m="8px 16px" sx={{ position: 'relative' }}>
        <Styled>
          <input
            type="range"
            min="0"
            max="100"
            value={value}
            style={getBackgroundSize()}
            onChange={({ currentTarget }) => {
              setValue(currentTarget.value)
            }}
          />
        </Styled>
      </Flex>
      <Indicator left={indicatorOffset}>
        <Text color="white" fontFamily="inter" fontWeight="600">
          {formatNumberFixed(value, 0)}%
        </Text>
      </Indicator>
    </Box>
  )
}

export default Slider
