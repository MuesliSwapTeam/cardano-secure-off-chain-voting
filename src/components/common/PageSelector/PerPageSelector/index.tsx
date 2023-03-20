import Selector from 'components/common/Selector'
import { ChangeEvent } from 'react'
import { Box, Flex, Text } from 'rebass/styled-components'

const OPTIONS = [10, 20, 50, 100]

export default function PerPageSelector({ perPage, setPerPage, setPage }) {
  const onChange = ({ target: { value } }: ChangeEvent<HTMLSelectElement>) => {
    if (value === undefined) return

    setPerPage(Number.parseInt(value, 10))
    setPage(0)
  }

  return (
    <Flex as="label" flexDirection="column" alignItems="center">
      <Text as="label" variant="tiny" m="4px" width="max-content">
        Show Rows
      </Text>

      <Box mr="15px">
        <Selector
          value={perPage}
          selectValue={onChange}
          options={OPTIONS.map((v) => ({ key: v.toString(), value: v.toString() }))}
        />
      </Box>
    </Flex>
  )
}
