import { useCallback, useMemo } from 'react'
import { Link, Text } from 'rebass/styled-components'
import breakInTheMiddle from 'utils/breakLineInTheMiddle'

import useToasts from './useToasts'

export enum WalletErrorTypes {
  // APIError
  INVALID, // InvalidRequest - Inputs do not conform spec or are otherwise invalid
  INTERNAL, // InternalError - Error occurred during execution of this API call
  REFUSED, // Refused - The request was refused due to a lack of access
  ACCOUNT_CHANGED, // AccountChanged - The account has changed.

  // TxSignError & DataSignError
  PROOF_GENERATION, // ProofGeneration - User has accepted but signing failed
  ADDRESS_NOT_PK, // AddressNotPk - Address was not a P2PK address and thus not SK associated with it
  USER_DECLINED, // UserDeclined - User declined to sign the data

  // TxSendError
  SEND_REFUSED, // Wallet refused to send the tx (could be rate limiting)
  SEND_FAILED, // Wallet could not send the tx

  // Custom
  NO_COLLATERAL,
  INVALID_COLLATERAL,
  UNSUPPORTED_PROVIDER,
  INVALID_ORDER,
}

export class WalletError extends Error {
  readonly errorType: WalletErrorTypes

  readonly docsLink?: string

  readonly userMessage: string

  constructor(errorType: WalletErrorTypes, msg?: string) {
    super(msg)
    this.errorType = errorType

    switch (this.errorType) {
      case WalletErrorTypes.SEND_FAILED:
        this.userMessage = 'Your wallet could not submit the transaction! Please try again later.'
        break
      case WalletErrorTypes.SEND_REFUSED:
        this.userMessage = 'Your wallet declined to submit this transaction. Please try again later.'
        break
      case WalletErrorTypes.ACCOUNT_CHANGED:
        this.userMessage = 'Your account has changed, please reload the page & try again.'
        break
      case WalletErrorTypes.USER_DECLINED:
        this.userMessage = 'You canceled the transaction.'
        break
      case WalletErrorTypes.NO_COLLATERAL:
        this.userMessage = 'No collateral is set. For smart contract interactions you need a collateral!'
        this.docsLink = 'https://docs.muesliswap.com/cardano/cardano-wallets#3.-adding-collateral'
        break
      case WalletErrorTypes.INVALID_COLLATERAL:
        this.userMessage = 'There is an issue with your collateral. Please remove it and add it back again.'
        this.docsLink = 'https://docs.muesliswap.com/cardano/cardano-wallets#3.-adding-collateral'
        break
      case WalletErrorTypes.UNSUPPORTED_PROVIDER:
        this.userMessage =
          'We can not cancel this provider, as it is not know to us. Please contact the team with your order details.'
        break
      case WalletErrorTypes.INVALID_ORDER:
        this.userMessage = 'There is an issue with your order. Please contact the team with more details.'
        break
      default:
        this.docsLink = 'https://docs.muesliswap.com'
        this.userMessage = 'Something went wrong!\nPlease contact the team.'
        break
    }

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, WalletError.prototype)
  }

  getMessage() {
    return this.userMessage
  }

  getDocsLink() {
    return this.docsLink
  }
}

export enum WalletInteractions {
  ORDER_PLACING,
  ORDER_CANCELATION,
  ORDER_WITHDRAW,
  ORDER_CHANGE,

  STAKE,
  UNSTAKE,
  HARVEST,

  LIQUIDITY_ADD,
  LIQUIDITY_REMOVE,

  TRANSFORM_REQUEST,
  REDEEM_REQUEST,
}

export interface SuccessMessage {
  txHash?: string
  msg?: string
}

function getSuccessMessage(interactionType: WalletInteractions, result: SuccessMessage) {
  const { txHash, msg } = result

  let title
  let additionalMessages
  switch (interactionType) {
    case WalletInteractions.ORDER_PLACING:
      title = 'Order placed'
      additionalMessages = undefined
      break
    case WalletInteractions.ORDER_CANCELATION:
      title = 'Order canceled'
      additionalMessages = undefined
      break
    case WalletInteractions.ORDER_WITHDRAW:
      title = 'Order withdrawn'
      additionalMessages = undefined
      break
    case WalletInteractions.ORDER_CHANGE:
      title = 'Order changed'
      additionalMessages = undefined
      break
    case WalletInteractions.STAKE:
      title = 'Stake order placed'
      additionalMessages = undefined
      break
    case WalletInteractions.HARVEST:
      title = 'Harvest order placed'
      additionalMessages = undefined
      break
    case WalletInteractions.UNSTAKE:
      title = 'Unstake order placed'
      additionalMessages = undefined
      break
    case WalletInteractions.LIQUIDITY_ADD:
      title = 'Liquidity added'
      additionalMessages = undefined
      break
    case WalletInteractions.LIQUIDITY_REMOVE:
      title = 'Liquidity removed'
      additionalMessages = undefined
      break
    case WalletInteractions.REDEEM_REQUEST:
    case WalletInteractions.TRANSFORM_REQUEST:
      title = 'Transform request placed'
      additionalMessages = undefined
      break
    default:
      title = 'Success!'
      additionalMessages = undefined
  }

  return (
    <>
      <Text variant="subheading">{title}</Text>
      {additionalMessages}
      {msg && <Text variant="regular">{msg}</Text>}
      {txHash && (
        <Link
          variant="regular"
          href={`https://cardanoscan.io/transaction/${txHash}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {breakInTheMiddle(txHash, 20)}
        </Link>
      )}
    </>
  )
}

function getErrorMessage(interactionType: WalletInteractions, error) {
  let title
  let additionalMessages
  switch (interactionType) {
    case WalletInteractions.ORDER_PLACING:
      title = 'Order placement failed'
      additionalMessages = undefined
      break
    case WalletInteractions.ORDER_CANCELATION:
      title = 'Order cancelation failed'
      additionalMessages = undefined
      break
    case WalletInteractions.ORDER_WITHDRAW:
      title = 'Order withdraw failed'
      additionalMessages = undefined
      break
    case WalletInteractions.ORDER_CHANGE:
      title = 'Order change failed'
      additionalMessages = undefined
      break
    case WalletInteractions.STAKE:
      title = 'Staking failed'
      additionalMessages = undefined
      break
    case WalletInteractions.UNSTAKE:
      title = 'Unstaking failed'
      additionalMessages = undefined
      break
    case WalletInteractions.LIQUIDITY_ADD:
      title = 'Liquidity addition failed'
      additionalMessages = undefined
      break
    case WalletInteractions.LIQUIDITY_REMOVE:
      title = 'Liquidity removing failed'
      additionalMessages = undefined
      break
    case WalletInteractions.TRANSFORM_REQUEST:
      title = 'Transform request failed'
      additionalMessages = undefined
      break
    case WalletInteractions.REDEEM_REQUEST:
      title = 'Redeem request failed'
      additionalMessages = undefined
      break
    default:
      title = 'Error!'
      additionalMessages = undefined
  }

  let details
  if (error instanceof WalletError) {
    const message = error.getMessage()
    const docsRef = error.getDocsLink()
    details = (
      <>
        <Text variant="regular">Something went wrong{message ? ':' : '!'}</Text>
        {message && (
          <Text variant="subtle" fontStyle="italic">
            {message}
          </Text>
        )}
        {additionalMessages}
        {docsRef && (
          <Link variant="regular" href={docsRef} target="_blank" rel="noopener noreferrer">
            Learn more.
          </Link>
        )}
      </>
    )
  } else {
    const message = error?.message ?? error?.info ?? error
    details = (
      <>
        <Text variant="regular">Something went wrong:</Text>
        <Text variant="subtle" fontStyle="italic">
          {JSON.stringify(message, Object.getOwnPropertyNames(message))}
        </Text>
      </>
    )
  }

  return (
    <>
      <Text variant="subheading">{title}</Text>
      {details}
    </>
  )
}

export default function useOnWalletInteraction(interactionType: WalletInteractions) {
  const { success, error } = useToasts()

  const onSuccess = useCallback(
    (result: SuccessMessage) => {
      success(getSuccessMessage(interactionType, result))
    },
    [success, interactionType],
  )

  const onError = useCallback(
    (err) => {
      error(getErrorMessage(interactionType, err))
    },
    [error, interactionType],
  )

  return useMemo(() => ({ onSuccess, onError }), [onSuccess, onError])
}
