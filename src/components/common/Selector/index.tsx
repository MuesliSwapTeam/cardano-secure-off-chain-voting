import { ArrowUp } from 'assets/icons'
import { Flex } from 'rebass/styled-components'

import { StyledAppearance, StyledSelect } from './styled'

export default function Selector({
  value,
  selectValue,
  options,
  small,
}: {
  value: string
  selectValue: (string) => void
  options: { key: string; value: string }[]
  small?: boolean
}) {
  return (
    <Flex justifyContent="center" alignItems="center">
      <StyledSelect value={value} onChange={selectValue} small={small}>
        {options.map((v) => (
          <option key={v.key}>{v.value}</option>
        ))}
      </StyledSelect>
      <StyledAppearance>
        <ArrowUp />
      </StyledAppearance>
    </Flex>
  )
}
Selector.defaultProps = { small: false }
