import { WalletContext } from 'context/wallet'
import { useCallback, useContext, useEffect, useMemo, useReducer, useState } from 'react'
import { useInterval } from 'react-use'
import { TokenAddress } from 'state/types'
import { fromTokenAddress, isAda, toTokenAddress } from 'utils/tokenAddress'

import { useCardano } from './useCardanoApi'

const useBalance = (wallet) => {
  const [balance, setBalance] = useState(undefined)
  const { baseWalletApi: api } = useCardano()

  const updateBalance = useCallback(() => {
    if (wallet && api) {
      api.getAdaBalance(wallet).then((data) => {
        setBalance(parseFloat(data))
      })
    } else {
      setBalance(undefined)
    }
  }, [api, wallet])

  // Make sure to update balance on wallet or address change
  useEffect(() => {
    updateBalance()
  }, [updateBalance])

  // And also regularly, so it's up to date
  useInterval(() => {
    updateBalance()
  }, 10000)

  return balance
}

const useTokenBalance = (wallet, address: TokenAddress) => {
  const [balance, setBalance] = useState(undefined)
  const { baseWalletApi: api } = useCardano()

  const updateBalance = useCallback(() => {
    if (wallet && api) {
      if (isAda(address)) {
        api.getAdaBalance(wallet).then((data) => {
          setBalance(parseFloat(data) * 1e6)
        })
      } else {
        api.getTokenBalance(wallet, address.policyId, address.name).then((data) => setBalance(parseFloat(data)))
      }
    } else {
      setBalance(undefined)
    }
  }, [address, api, wallet])

  // Make sure to update balance on wallet or address change
  useEffect(() => {
    setBalance(undefined)
    updateBalance()
  }, [updateBalance])

  // And also regularly, so it's up to date
  useInterval(() => {
    updateBalance()
  }, 10000)

  return balance
}

export type TokenBalanceArray = { [address: string]: number }
const useTokenBalances = (wallet): TokenBalanceArray => {
  const [myAssets, setMyAssets] = useState({})

  const { baseWalletApi: api } = useCardano()
  useEffect(() => {
    if (wallet && api) {
      api.getAllTokenBalances(wallet).then((data) => {
        const tokens = Object.entries(data).map(([key, value]) => {
          if (key === 'lovelace') {
            return [fromTokenAddress(toTokenAddress('', '')), value]
          }
          const addr = toTokenAddress(key, undefined, true)
          return [fromTokenAddress(addr), value]
        })
        setMyAssets(Object.fromEntries(tokens))
      })
    } else {
      setMyAssets({})
    }
  }, [wallet, api])
  return myAssets
}

const useAddress = (wallet) => {
  const [address, setAddress] = useState(undefined)
  const { baseWalletApi: api } = useCardano()
  useEffect(() => {
    if (wallet && api) {
      api.getWalletAddress(wallet).then((addr) => {
        if (addr) {
          setAddress(addr)
        }
      })
    } else {
      setAddress(undefined)
    }
  }, [wallet, api])
  return address
}

const useAdaHandles = (wallet) => {
  const [handles, setHandles] = useState(undefined)
  const { baseWalletApi: api } = useCardano()

  useEffect(() => {
    if (wallet && api) {
      api.getAdaHandles(wallet).then((adaHandles) => {
        if (adaHandles) {
          setHandles(adaHandles)
        }
      })
    } else {
      setHandles(undefined)
    }
  }, [wallet, api])

  return handles
}

const useHungryCows = (wallet) => {
  const [cows, setCows] = useState(undefined)
  const { baseWalletApi: api } = useCardano()

  useEffect(() => {
    if (wallet && api) {
      api.getHungryCows(wallet).then((hungryCows) => {
        if (hungryCows) {
          setCows(hungryCows)
        }
      })
    } else {
      setCows(undefined)
    }
  }, [wallet, api])

  return cows
}

const usePublicKeyAddressPairs: () => { pubKeyHash: string; address: string }[] = () => {
  const [pubKeyHashes, setPubKeyHashes] = useState([])
  const { wallet } = useContext(WalletContext)

  const { baseWalletApi: api } = useCardano()
  useEffect(() => {
    const helper = async () => {
      const pkhs = []
      if (wallet?.getUsedAddresses && api) {
        const addresses = Object.values(await wallet.getUsedAddresses())

        await addresses.forEach(async (address) => {
          const pkh = await api.getPublicKeyHash(address)
          if (pkh) pkhs.push({ pubKeyHash: pkh, address })
        })
      }
      return pkhs
    }

    helper().then((pkhs) => setPubKeyHashes(pkhs))
  }, [api, wallet, setPubKeyHashes])

  return pubKeyHashes
}

const usePublicKeyHashes: () => string[] = () => {
  const [pubKeyHashes, setPubKeyHashes] = useState([])
  const { wallet } = useContext(WalletContext)

  const { baseWalletApi: api } = useCardano()
  useEffect(() => {
    const helper = async () => {
      const pkhs = []
      if (wallet?.getUsedAddresses && api) {
        const addresses = Object.values(await wallet.getUsedAddresses())

        await addresses.forEach(async (address) => {
          const pkh = await api.getPublicKeyHash(address)
          if (pkh) pkhs.push(pkh)
        })
      }
      return pkhs
    }

    helper().then((pkhs) => setPubKeyHashes(pkhs))
  }, [api, wallet, setPubKeyHashes])

  return pubKeyHashes
}

const useStakeKeys: () => string[] = () => {
  const reducer = useCallback((state, keyHash) => [...state, keyHash], [])

  const [keyHashes, addKeyHash] = useReducer(reducer, [])
  const { wallet } = useContext(WalletContext)

  const { baseWalletApi: api } = useCardano()
  useEffect(() => {
    if (wallet?.getUsedAddresses && api) {
      wallet.getUsedAddresses().then((addresses) => {
        new Set(addresses).forEach((k) => {
          const stakeKey = k.substring(58)
          if (!keyHashes.includes(stakeKey)) addKeyHash(stakeKey)
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api, wallet, addKeyHash])

  return keyHashes
}

const useAddresses: () => string[] = () => {
  const reducer = useCallback((state, keyHash) => [...state, keyHash], [])

  const [keyHashes, addKeyHash] = useReducer(reducer, [])
  const { wallet } = useContext(WalletContext)

  const { baseWalletApi: api } = useCardano()
  useEffect(() => {
    if (wallet?.getUsedAddresses && api) {
      wallet.getUsedAddresses().then((addresses) => {
        new Set(addresses).forEach(addKeyHash)
      })
    }
  }, [api, wallet, addKeyHash])

  return keyHashes
}

export const useWallet = () => {
  const walletContext = useContext(WalletContext)
  const { wallet } = walletContext

  const helpers = useMemo(
    () => ({
      useAddress: () => useAddress(wallet),
      useAdaHandles: () => useAdaHandles(wallet),
      useHungryCows: () => useHungryCows(wallet),
      useBalance: () => useBalance(wallet),
      useTokenBalance: (address) => useTokenBalance(wallet, address),
      useTokenBalances: () => useTokenBalances(wallet),
      usePublicKeyHashes,
      usePublicKeyAddressPairs,
      useAddresses,
      useStakeKeys,
    }),
    [wallet],
  )

  return {
    ...walletContext,
    ...helpers,
  }
}
