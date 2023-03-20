import { Text, TextProps } from 'rebass/styled-components'

export default function PageHeader({ children }: Pick<TextProps, 'children'>) {
  return (
    <Text as="h2" fontFamily="gilroy" fontWeight="600" fontSize="40px" letterSpacing="-0.64px" color="text">
      {children}
    </Text>
  )
}
