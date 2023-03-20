import React, { useEffect } from 'react'

export default function SubPage({ title, children }: React.PropsWithChildren<{ title?: string }>) {
  useEffect(() => {
    if (title) {
      document.title = `MuesliSwap Vote | ${title}`
    } else {
      document.title = 'MuesliSwap Vote | Cardano Off-Chain Voting'
    }
  }, [title])

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>
}

SubPage.defaultProps = { title: undefined }
