import { createContext, useEffect, useState } from 'react'
import { useEffectOnce } from 'react-use'

import { CardanoContextType } from './types'

export const CardanoContext = createContext<CardanoContextType>(undefined)

export function CardanoProvider({ children }) {
  const [baseWalletApi, setBaseWalletApi] = useState(undefined)
  const [orderbookV1Api, setOrderbookV1Api] = useState(undefined)
  const [orderbookV2Api, setOrderbookV2Api] = useState(undefined)
  const [stakingApi, setStakingApi] = useState(undefined)
  const [farmingApi, setFarmingApi] = useState(undefined)
  const [myieldStakingApi, setMyieldStakingApi] = useState(undefined)
  const [minswapApi, setMinswapApi] = useState(undefined)
  const [sundaeswapApi, setSundaeswapApi] = useState(undefined)
  const [wingridersApi, setWingridersApi] = useState(undefined)
  const [addLiquidityApi, setAddLiquidityApi] = useState(undefined)
  const [removeLiquidityApi, setRemoveLiquidityApi] = useState(undefined)
  const [launchpadApi, setLaunchpadApi] = useState(undefined)

  // TODO pjordan: Remove this line once createPoolApi gets actually used
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [createPoolApi, setCreatePoolApi] = useState(undefined)

  useEffectOnce(() => {
    if (baseWalletApi === undefined) {
      import('cardano/baseWallet').then((m) => {
        m.cardanoInit().then(() => setBaseWalletApi(m))
      })
    }
    // orderbook v1 referering to plutus v1 script
    if (orderbookV1Api === undefined) {
      import('cardano/muesliswap/orderbook').then((m) => {
        m.cardanoInit().then(() => setOrderbookV1Api(m))
      })
    }

    if (orderbookV2Api === undefined) {
      import('cardano/muesliswap/orderbookv2').then((m) => {
        m.cardanoInit().then(() => setOrderbookV2Api(m))
      })
    }
    if (launchpadApi === undefined) {
      import('cardano/launchpad/transfer').then((m) => {
        m.cardanoInit().then(() => setLaunchpadApi(m))
      })
    }
    if (stakingApi === undefined) {
      import('cardano/muesliswap/staking').then((m) => {
        m.cardanoInit().then(() => setStakingApi(m))
      })
    }
    if (myieldStakingApi === undefined) {
      import('cardano/muesliswap/myield').then((m) => {
        m.cardanoInit().then(() => setMyieldStakingApi(m))
      })
    }

    if (farmingApi === undefined) {
      import('cardano/muesliswap/farming').then((m) => {
        m.cardanoInit().then(() => setFarmingApi(m))
      })
    }

    if (addLiquidityApi === undefined) {
      import('cardano/liquidity/lp_add').then((m) => {
        m.cardanoInit().then(() => setAddLiquidityApi(m))
      })
    }

    if (removeLiquidityApi === undefined) {
      import('cardano/liquidity/lp_remove').then((m) => {
        m.cardanoInit().then(() => setRemoveLiquidityApi(m))
      })
    }

    if (createPoolApi === undefined) {
      // NOTE pjordan: Disabled, so the wasm file does not get loaded
      // import('cardano/pool-creation/pool').then((m) => {
      //   m.cardanoInit().then(() => setCreatePoolApi(m))
      // })
    }

    if (minswapApi === undefined) {
      import('cardano/aggregator/minswap').then((m) => {
        m.cardanoInit().then(() => setMinswapApi(m))
      })
    }

    if (sundaeswapApi === undefined) {
      import('cardano/aggregator/sundae').then((m) => {
        m.cardanoInit().then(() => setSundaeswapApi(m))
      })
    }

    if (wingridersApi === undefined) {
      import('cardano/aggregator/wingriders').then((m) => {
        m.cardanoInit().then(() => setWingridersApi(m))
      })
    }
  })

  const [contextValue, setContextValue] = useState({
    baseWalletApi,
    orderbookV1Api,
    orderbookV2Api,
    stakingApi,
    myieldStakingApi,
    minswapApi,
    sundaeswapApi,
    farmingApi,
    wingridersApi,
    addLiquidityApi,
    removeLiquidityApi,
    createPoolApi,
    launchpadApi,
  })

  useEffect(() => {
    if (
      baseWalletApi &&
      orderbookV1Api &&
      orderbookV2Api &&
      stakingApi &&
      myieldStakingApi &&
      minswapApi &&
      sundaeswapApi &&
      wingridersApi &&
      addLiquidityApi &&
      removeLiquidityApi &&
      // TODO pjordan: Comment this back in, when poolApi is there
      // createPoolApi &&
      farmingApi &&
      launchpadApi
    ) {
      setContextValue({
        baseWalletApi,
        orderbookV1Api,
        orderbookV2Api,
        stakingApi,
        farmingApi,
        myieldStakingApi,
        minswapApi,
        sundaeswapApi,
        wingridersApi,
        addLiquidityApi,
        removeLiquidityApi,
        createPoolApi,
        launchpadApi,
      })
    }
  }, [
    baseWalletApi,
    orderbookV1Api,
    orderbookV2Api,
    stakingApi,
    farmingApi,
    myieldStakingApi,
    minswapApi,
    sundaeswapApi,
    wingridersApi,
    addLiquidityApi,
    removeLiquidityApi,
    createPoolApi,
    launchpadApi,
  ])

  return <CardanoContext.Provider value={contextValue}> {children} </CardanoContext.Provider>
}
