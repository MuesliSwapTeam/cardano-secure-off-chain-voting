import React, { useEffect } from 'react'

import StyledContainer from './styled'

export default function Page({ title, children }: React.PropsWithChildren<{ title?: string }>) {
  useEffect(() => {
    if (title) {
      document.title = `MuesliSwap Vote | ${title}`
    } else {
      document.title = 'MuesliSwap Vote | Cardano Off-Chain Voting'
    }
  }, [title])

  return <StyledContainer>{children}</StyledContainer>
}

Page.defaultProps = { title: undefined }
