import { useMemo } from 'react'
import { usePreferredHandle } from 'state/user/hooks'

import { useWallet } from './useWallet'

export default function useDisplayAddress() {
  const { useAddress, useAdaHandles } = useWallet()
  const handles = useAdaHandles()
  const address = useAddress()

  const preferredHandle = usePreferredHandle(address)
  const handle = useMemo(() => {
    // This means that the user selected to not display the ada handle
    if (preferredHandle === null) return undefined

    if (handles && handles.length && preferredHandle && handles.includes(preferredHandle)) {
      return preferredHandle
    }

    return undefined
  }, [handles, preferredHandle])

  const displayAddress = useMemo(() => {
    if (handle) return handle
    if (address) return `${address.substring(0, 3)}...${address.substring(address.length - 4, address.length)}`

    return ''
  }, [handle, address])

  return { text: displayAddress, isAdaHandle: !!handle }
}
