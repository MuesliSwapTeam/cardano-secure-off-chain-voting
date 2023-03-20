export enum Network {
  MAINNET = 1,
  TESTNET = 0,
}

const LOCAL_STORAGE_NETWORK_ID = 'cardanoNetworkId'

export const setNetworkId = (id: Network) => localStorage.setItem(LOCAL_STORAGE_NETWORK_ID, id.toString())

export const getNetworkId = () => {
  const id = localStorage.getItem(LOCAL_STORAGE_NETWORK_ID)
  if (id === '0' || id === '1') {
    return Number(id)
  }
  return Network.MAINNET
}

export const isTestnet = () => getNetworkId() === Network.TESTNET
export const isMainnet = () => getNetworkId() === Network.MAINNET
