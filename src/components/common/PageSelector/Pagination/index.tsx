import { ArrowRight } from 'assets/icons'
import { MouseEventHandler, useCallback, useEffect, useMemo } from 'react'
import { useMedia, useSize } from 'react-use'
import { Flex, Text } from 'rebass/styled-components'
import range from 'utils/range'

import { BUTTON_SIZE, StyledButton, StyledPageButton, StyledPageSpace } from './styled'

interface Props {
  count: number
  page: number
  onChange(value: number): void
}

function Spacer() {
  return (
    <StyledPageSpace>
      <Text variant="regular" sx={{ margin: 'auto' }}>
        ...
      </Text>
    </StyledPageSpace>
  )
}

export default function Pagination({ count, page, onChange }: Props) {
  const pages = useMemo(() => range(count), [count])
  const onClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    ({ currentTarget }) => {
      const value = currentTarget?.value
      if (!value) return

      onChange(Number(value))
    },
    [onChange],
  )

  const isTiny = useMedia('(max-width: 525px)')
  const isSmall = useMedia('(max-width: 1000px)')

  const [pagingContent] = useSize(({ width }) => {
    const sideNo = !isTiny ? (!isSmall ? 3 : 0) : 0
    const addedPadding = !isTiny ? (!isSmall ? 5 : 4) : 2
    const fittingNoOfElems = Math.max(Math.floor(width / (BUTTON_SIZE + 10)) - 2 * (sideNo + addedPadding), 0)
    if (pages.length <= fittingNoOfElems) {
      return (
        <>
          {pages.map((key) => (
            <StyledPageButton key={key} type="button" current={page === key} value={key} onClick={onClick}>
              {key + 1}
            </StyledPageButton>
          ))}
        </>
      )
    }

    let centerNo = 1
    let middlePages = []
    let aligned
    if (page + 1 > sideNo && page < pages.length - sideNo) {
      // Calculate distance to borders
      const borderDist = Math.min(page + 1 - sideNo, pages.length - sideNo - page)
      // Make sure we don't grow bigger than space is available
      centerNo = Math.min(borderDist, fittingNoOfElems)
      // Make sure at least three center elements are shown
      centerNo = Math.max(centerNo, 2)
      if (page - centerNo + 1 === sideNo) aligned = 'left'
      if (Math.max(page + centerNo, pages.length - 1) === pages.length - sideNo) aligned = 'right'
      middlePages = pages.slice(Math.max(0, page - centerNo + 1), Math.min(page + centerNo, pages.length))
    }

    const firstPages = pages.slice(0, sideNo)
    const lastPages = pages.slice(pages.length - sideNo, pages.length)
    return (
      <>
        {firstPages.map((key) => (
          <StyledPageButton key={key} type="button" current={page === key} value={key} onClick={onClick}>
            {key + 1}
          </StyledPageButton>
        ))}
        {firstPages.length !== 0 && aligned !== 'left' && <Spacer />}
        {middlePages.map((key) => (
          <StyledPageButton key={key} type="button" current={page === key} value={key} onClick={onClick}>
            {key + 1}
          </StyledPageButton>
        ))}
        {middlePages.length !== 0 && lastPages.length !== 0 && aligned !== 'right' && <Spacer />}
        {lastPages.map((key) => (
          <StyledPageButton key={key} type="button" current={page === key} value={key} onClick={onClick}>
            {key + 1}
          </StyledPageButton>
        ))}
      </>
    )
  }, {})

  useEffect(() => {
    if (page > count) onChange(0)
  }, [page, count, onChange])

  return (
    <Flex width="100%" justifyContent="center" alignItems="center">
      <StyledButton
        type="button"
        aria-label="previous page"
        disabled={page === 0}
        value={page - 1}
        onClick={onClick}
        isPrev
      >
        <ArrowRight />
      </StyledButton>

      {pagingContent}

      <StyledButton
        type="button"
        aria-label="next page"
        disabled={page === count - 1}
        value={page + 1}
        onClick={onClick}
      >
        <ArrowRight />
      </StyledButton>
    </Flex>
  )
}
