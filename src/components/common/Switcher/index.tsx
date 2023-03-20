import { StyledInput, StyledSlider, StyledSwitch } from './styled'

interface Props {
  label?: string
  checked: boolean
  margin?: string
  toggle?: () => void
}

export default function Switcher({ checked, toggle, margin, label }: Props) {
  return (
    <StyledSwitch margin={margin} aria-label={label}>
      <StyledInput disabled={toggle === null} type="checkbox" checked={checked} onChange={toggle} />
      <StyledSlider />
    </StyledSwitch>
  )
}

Switcher.defaultProps = {
  label: undefined,
  margin: 0,
  toggle: null,
}
