/* eslint-disable @typescript-eslint/no-explicit-any */
import { ConnectorName } from 'config/walletConnectors'
import { WalletError, WalletErrorTypes } from 'hooks/useOnWalletInteraction'

import {
  Address,
  Bytes,
  CBOR,
  Hash32,
  Paginate,
  SigStructure,
  Transaction,
  TransactionUnspentOutput,
  TransactionWitnessSet,
  Value,
  WalletProtoApiType,
} from './types'

enum WalletApiErrorType {
  INJECTION_ERR,
  UNKNOWN_CONN_ID,
  UNKNOWN_METHOD,
  NOT_ENABLED,
  UNSUPPORTED,
}

interface WalletApiError {
  type: WalletApiErrorType
  message?: string
}

const newWalletError = (type: WalletApiErrorType, message?: string): WalletApiError => ({
  type,
  message: `${WalletApiErrorType[type]}: ${message}`,
})

export const retreiveWalletApi = (connectorId: ConnectorName, globalFallback = true) => {
  let wallet
  switch (connectorId) {
    case ConnectorName.Nami:
      wallet = window.cardano?.nami
      if (!wallet && globalFallback) {
        wallet = window.cardano
      }
      break
    case ConnectorName.Eternl:
      wallet = window.cardano?.eternl
      break
    case ConnectorName.Gero:
      wallet = window.cardano?.gerowallet
      break
    case ConnectorName.Flint:
      wallet = window.cardano?.flint
      break
    case ConnectorName.Typhon:
      wallet = window.cardano?.typhoncip30
      break
    case ConnectorName.Nufi:
      wallet = window.cardano?.nufi
      break
    default:
      throw newWalletError(WalletApiErrorType.UNKNOWN_CONN_ID, connectorId)
  }
  if (!wallet) {
    throw newWalletError(WalletApiErrorType.INJECTION_ERR)
  }
  return wallet
}

export const enable = async (connectorId: ConnectorName) => {
  const wallet = retreiveWalletApi(connectorId)

  if (!wallet.enable) {
    throw newWalletError(WalletApiErrorType.INJECTION_ERR, 'Could not find enable function')
  }

  switch (connectorId) {
    case ConnectorName.Nami:
      if (!window.cardano?.nami) {
        wallet.enable()
        return window.cardano
      }
      return wallet.enable()
    case ConnectorName.Gero:
    case ConnectorName.Eternl:
    case ConnectorName.Flint:
    case ConnectorName.Typhon:
    case ConnectorName.Nufi:
      return wallet.enable()
    default:
      throw newWalletError(WalletApiErrorType.UNKNOWN_CONN_ID, connectorId)
  }
}

// Might be better to return the wallet API instead of true and false
export const isEnabled = async (connectorId: ConnectorName) => {
  let wallet
  try {
    wallet = retreiveWalletApi(connectorId)
  } catch {
    throw newWalletError(WalletApiErrorType.INJECTION_ERR, 'Can not check status for uninjected wallet')
  }

  if (!wallet.isEnabled) {
    return newWalletError(WalletApiErrorType.INJECTION_ERR, 'Could not find isEnabled function')
  }

  switch (connectorId) {
    case ConnectorName.Nami:
    case ConnectorName.Gero:
    case ConnectorName.Eternl:
    case ConnectorName.Flint:
    case ConnectorName.Typhon:
    case ConnectorName.Nufi:
      return wallet.isEnabled()
    default:
      throw newWalletError(WalletApiErrorType.UNKNOWN_CONN_ID, connectorId)
  }
}

export const getNetworkId = async (wallet: WalletProtoApiType, connectorId: ConnectorName): Promise<number> => {
  switch (connectorId) {
    case ConnectorName.Nami:
    case ConnectorName.Gero:
    case ConnectorName.Eternl:
    case ConnectorName.Flint:
    case ConnectorName.Typhon:
    case ConnectorName.Nufi:
      return wallet.getNetworkId()
    default:
      throw newWalletError(WalletApiErrorType.UNKNOWN_CONN_ID, connectorId)
  }
}

export const getUtxos = async (
  wallet: WalletProtoApiType,
  connectorId: ConnectorName,
  amount?: CBOR<Value>,
  paginate?: Paginate,
): Promise<TransactionUnspentOutput[] | undefined> => {
  try {
    switch (connectorId) {
      case ConnectorName.Nami:
      case ConnectorName.Gero:
      case ConnectorName.Eternl:
      case ConnectorName.Flint:
      case ConnectorName.Typhon:
      case ConnectorName.Nufi:
        if (amount === undefined && paginate === undefined) {
          return wallet.getUtxos()
        }
        if (paginate === undefined) {
          return wallet.getUtxos(amount)
        }
        return wallet.getUtxos(amount, paginate)
      default:
        throw newWalletError(WalletApiErrorType.UNKNOWN_CONN_ID, connectorId)
    }
  } catch (err: any) {
    // TODO pjordan: Add paginate error codes
    switch (err.code) {
      case -4:
        throw new WalletError(WalletErrorTypes.ACCOUNT_CHANGED, err.info)
      case -3:
        throw new WalletError(WalletErrorTypes.REFUSED, err.info)
      case -2:
        throw new WalletError(WalletErrorTypes.INTERNAL, err.info)
      case -1:
        throw new WalletError(WalletErrorTypes.INVALID, err.info)
      default:
        throw err
    }
  }
}

export const getBalance = async (wallet: WalletProtoApiType, connectorId: ConnectorName): Promise<CBOR<Value>> => {
  try {
    switch (connectorId) {
      case ConnectorName.Nami:
      case ConnectorName.Gero:
      case ConnectorName.Eternl:
      case ConnectorName.Flint:
      case ConnectorName.Typhon:
      case ConnectorName.Nufi:
        return wallet.getBalance()
      default:
        throw newWalletError(WalletApiErrorType.UNKNOWN_CONN_ID, connectorId)
    }
  } catch (err: any) {
    switch (err.code) {
      case -4:
        throw new WalletError(WalletErrorTypes.ACCOUNT_CHANGED, err.info)
      case -3:
        throw new WalletError(WalletErrorTypes.REFUSED, err.info)
      case -2:
        throw new WalletError(WalletErrorTypes.INTERNAL, err.info)
      case -1:
        throw new WalletError(WalletErrorTypes.INVALID, err.info)
      default:
        throw err
    }
  }
}

export const getUsedAddresses = async (
  wallet: WalletProtoApiType,
  connectorId: ConnectorName,
  paginate?: Paginate,
): Promise<CBOR<Address>[]> => {
  try {
    switch (connectorId) {
      case ConnectorName.Nami:
      case ConnectorName.Gero:
      case ConnectorName.Eternl:
      case ConnectorName.Flint:
      case ConnectorName.Typhon:
      case ConnectorName.Nufi:
        if (paginate === undefined) {
          return wallet.getUsedAddresses()
        }
        return wallet.getUsedAddresses(paginate)
      default:
        throw newWalletError(WalletApiErrorType.UNKNOWN_CONN_ID, connectorId)
    }
  } catch (err: any) {
    switch (err.code) {
      case -4:
        throw new WalletError(WalletErrorTypes.ACCOUNT_CHANGED, err.info)
      case -3:
        throw new WalletError(WalletErrorTypes.REFUSED, err.info)
      case -2:
        throw new WalletError(WalletErrorTypes.INTERNAL, err.info)
      case -1:
        throw new WalletError(WalletErrorTypes.INVALID, err.info)
      default:
        throw err
    }
  }
}

export const getUnusedAddresses = async (
  wallet: WalletProtoApiType,
  connectorId: ConnectorName,
): Promise<CBOR<Address>[]> => {
  try {
    switch (connectorId) {
      case ConnectorName.Nami:
      case ConnectorName.Gero:
      case ConnectorName.Eternl:
      case ConnectorName.Flint:
      case ConnectorName.Typhon:
      case ConnectorName.Nufi:
        return wallet.getUnusedAddresses()
      default:
        throw newWalletError(WalletApiErrorType.UNKNOWN_CONN_ID, connectorId)
    }
  } catch (err: any) {
    switch (err.code) {
      case -4:
        throw new WalletError(WalletErrorTypes.ACCOUNT_CHANGED, err.info)
      case -3:
        throw new WalletError(WalletErrorTypes.REFUSED, err.info)
      case -2:
        throw new WalletError(WalletErrorTypes.INTERNAL, err.info)
      case -1:
        throw new WalletError(WalletErrorTypes.INVALID, err.info)
      default:
        throw err
    }
  }
}

export const getChangeAddress = async (
  wallet: WalletProtoApiType,
  connectorId: ConnectorName,
): Promise<CBOR<Address>> => {
  try {
    switch (connectorId) {
      case ConnectorName.Nami:
      case ConnectorName.Gero:
      case ConnectorName.Eternl:
      case ConnectorName.Flint:
      case ConnectorName.Typhon:
      case ConnectorName.Nufi:
        return wallet.getChangeAddress()
      default:
        throw newWalletError(WalletApiErrorType.UNKNOWN_CONN_ID, connectorId)
    }
  } catch (err: any) {
    switch (err.code) {
      case -4:
        throw new WalletError(WalletErrorTypes.ACCOUNT_CHANGED, err.info)
      case -3:
        throw new WalletError(WalletErrorTypes.REFUSED, err.info)
      case -2:
        throw new WalletError(WalletErrorTypes.INTERNAL, err.info)
      case -1:
        throw new WalletError(WalletErrorTypes.INVALID, err.info)
      default:
        throw err
    }
  }
}

export const getRewardAddresses = async (
  wallet: WalletProtoApiType,
  connectorId: ConnectorName,
): Promise<CBOR<Address>[]> => {
  try {
    switch (connectorId) {
      case ConnectorName.Nami:
      case ConnectorName.Gero:
      case ConnectorName.Eternl:
      case ConnectorName.Flint:
      case ConnectorName.Typhon:
      case ConnectorName.Nufi:
        return wallet.getRewardAddresses()
      default:
        throw newWalletError(WalletApiErrorType.UNKNOWN_CONN_ID, connectorId)
    }
  } catch (err: any) {
    switch (err.code) {
      case -4:
        throw new WalletError(WalletErrorTypes.ACCOUNT_CHANGED, err.info)
      case -3:
        throw new WalletError(WalletErrorTypes.REFUSED, err.info)
      case -2:
        throw new WalletError(WalletErrorTypes.INTERNAL, err.info)
      case -1:
        throw new WalletError(WalletErrorTypes.INVALID, err.info)
      default:
        throw err
    }
  }
}

export const signTx = async (
  wallet: WalletProtoApiType,
  connectorId: ConnectorName,
  tx: CBOR<Transaction>,
  partialSign?: boolean,
): Promise<CBOR<TransactionWitnessSet>> => {
  try {
    switch (connectorId) {
      case ConnectorName.Nami:
      case ConnectorName.Gero:
      case ConnectorName.Eternl:
      case ConnectorName.Flint:
      case ConnectorName.Typhon:
      case ConnectorName.Nufi:
        if (partialSign === undefined) {
          return wallet.signTx(tx)
        }
        return wallet.signTx(tx, partialSign)
      default:
        throw newWalletError(WalletApiErrorType.UNKNOWN_CONN_ID, connectorId)
    }
  } catch (err: any) {
    switch (err.code) {
      case -4:
        throw new WalletError(WalletErrorTypes.ACCOUNT_CHANGED, err.info)
      case -3:
        throw new WalletError(WalletErrorTypes.REFUSED, err.info)
      case -2:
        throw new WalletError(WalletErrorTypes.INTERNAL, err.info)
      case -1:
        throw new WalletError(WalletErrorTypes.INVALID, err.info)
      case 1:
        throw new WalletError(WalletErrorTypes.PROOF_GENERATION, err.info)
      case 2:
        throw new WalletError(WalletErrorTypes.USER_DECLINED, err.info)
      default:
        throw err
    }
  }
}

export const signData = async (
  wallet: WalletProtoApiType,
  connectorId: ConnectorName,
  addr: Address,
  sigStructure: CBOR<SigStructure>,
): Promise<Bytes> => {
  try {
    switch (connectorId) {
      case ConnectorName.Nami:
      case ConnectorName.Gero:
      case ConnectorName.Eternl:
      case ConnectorName.Flint:
      case ConnectorName.Typhon:
      case ConnectorName.Nufi:
        return wallet.signData(addr, sigStructure)
      default:
        throw newWalletError(WalletApiErrorType.UNKNOWN_CONN_ID, connectorId)
    }
  } catch (err: any) {
    switch (err.code) {
      case -4:
        throw new WalletError(WalletErrorTypes.ACCOUNT_CHANGED, err.info)
      case -3:
        throw new WalletError(WalletErrorTypes.REFUSED, err.info)
      case -2:
        throw new WalletError(WalletErrorTypes.INTERNAL, err.info)
      case -1:
        throw new WalletError(WalletErrorTypes.INVALID, err.info)
      case 1:
        throw new WalletError(WalletErrorTypes.PROOF_GENERATION, err.info)
      case 2:
        throw new WalletError(WalletErrorTypes.ADDRESS_NOT_PK, err.info)
      case 3:
        throw new WalletError(WalletErrorTypes.USER_DECLINED, err.info)
      default:
        throw err
    }
  }
}

export const submitTx = async (
  wallet: WalletProtoApiType,
  connectorId: ConnectorName,
  tx: CBOR<Transaction>,
): Promise<Hash32> => {
  try {
    switch (connectorId) {
      case ConnectorName.Nami:
      case ConnectorName.Gero:
      case ConnectorName.Eternl:
      case ConnectorName.Flint:
      case ConnectorName.Typhon:
      case ConnectorName.Nufi:
        return wallet.submitTx(tx)
      default:
        throw newWalletError(WalletApiErrorType.UNKNOWN_CONN_ID, connectorId)
    }
  } catch (err: any) {
    switch (err.code) {
      case -4:
        throw new WalletError(WalletErrorTypes.ACCOUNT_CHANGED, err.info)
      case -3:
        throw new WalletError(WalletErrorTypes.REFUSED, err.info)
      case -2:
        throw new WalletError(WalletErrorTypes.INTERNAL, err.info)
      case -1:
        throw new WalletError(WalletErrorTypes.INVALID, err.info)
      case 1:
        throw new WalletError(WalletErrorTypes.SEND_REFUSED, err.info)
      case 2:
        throw new WalletError(WalletErrorTypes.SEND_FAILED, err.info)
      default:
        throw err
    }
  }
}

export const getCollateral = async (
  wallet: WalletProtoApiType,
  connectorId: ConnectorName,
): Promise<TransactionUnspentOutput[]> => {
  try {
    switch (connectorId) {
      case ConnectorName.Nami:
        return wallet.experimental.getCollateral()
      case ConnectorName.Gero:
        // filter out empty strings
        return (await wallet.getCollateral()).filter((c) => c && c !== '')
      case ConnectorName.Eternl:
      case ConnectorName.Flint:
      case ConnectorName.Typhon:
      case ConnectorName.Nufi:
        return wallet.getCollateral()
      default:
        throw newWalletError(WalletApiErrorType.UNKNOWN_CONN_ID, connectorId)
    }
  } catch (err: any) {
    switch (err.code) {
      case -4:
        throw new WalletError(WalletErrorTypes.ACCOUNT_CHANGED, err.info)
      case -3:
        throw new WalletError(WalletErrorTypes.REFUSED, err.info)
      case -2:
        throw new WalletError(WalletErrorTypes.INTERNAL, err.info)
      case -1:
        throw new WalletError(WalletErrorTypes.INVALID, err.info)
      default:
        throw err
    }
  }
}
