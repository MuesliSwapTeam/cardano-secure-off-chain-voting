/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConnectorName } from 'config/walletConnectors'

export interface WalletProtoApiType {
  getNetworkId: () => Promise<number>
  getUtxos: (amount?: CBOR<Value>, paginate?: Paginate) => Promise<TransactionUnspentOutput[] | undefined>
  getBalance: () => Promise<CBOR<Value>>
  getUsedAddresses: (paginate?: unknown) => Promise<CBOR<Address>[]>
  getUnusedAddresses: () => Promise<CBOR<Address>[]>
  getChangeAddress: () => Promise<CBOR<Address>>
  getRewardAddresses: () => Promise<CBOR<Address>[]>
  signTx: (tx?: unknown, partialSign?: boolean) => Promise<CBOR<TransactionWitnessSet>>
  signData: (addr: unknown, sigStructure: unknown) => Promise<Bytes>
  submitTx: (tx: unknown) => Promise<Hash32>
  getCollateral?: () => Promise<TransactionUnspentOutput[]>
  experimental
}
export interface WalletApiType {
  getNetworkId: () => Promise<number>
  getUtxos: (amount?: CBOR<Value>, paginate?: Paginate) => Promise<TransactionUnspentOutput[] | undefined>
  getBalance: () => Promise<CBOR<Value>>
  getUsedAddresses: (paginate?: unknown) => Promise<CBOR<Address>[]>
  getUnusedAddresses: () => Promise<CBOR<Address>[]>
  getChangeAddress: () => Promise<CBOR<Address>>
  getRewardAddresses: () => Promise<CBOR<Address>[]>
  signTx: (tx?: unknown, partialSign?: boolean) => Promise<CBOR<TransactionWitnessSet>>
  signData: (addr: unknown, sigStructure: unknown) => Promise<Bytes>
  submitTx: (tx: unknown) => Promise<Hash32>
  getCollateral: () => Promise<TransactionUnspentOutput[]>
  disconnectWallet: () => Promise<void>
  isDAppConnector: () => boolean
  dAppFeeAddress: () => Address | null
}

export interface WalletContextType {
  connectorId: ConnectorName | undefined
  reloadWallet: () => void
  wallet: WalletApiType | undefined
  isWalletEnabled: boolean
  enableWallet: (w: any) => void
  enableDAppWallet: (w: any, c: ConnectorName) => void
  isWalletInstalled: (c: ConnectorName) => boolean
}

export type Value = number
export type Address = any
export type Transaction = any
export type TransactionWitnessSet = any
export type SigStructure = any

export type Hash32 = any
export type Bytes = string
export type Hex<T> = string
export type CBOR<T> = any

export type TransactionUnspentOutput = CBOR<any>
export type Paginate = any
export type ApiError = { code: number; info: string }
