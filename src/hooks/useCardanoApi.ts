import { Buffer } from 'buffer'
import { CardanoContext } from 'context/cardano'
import { useContext } from 'react'

export const fromHex = (hex) => Buffer.from(hex, 'hex')
export const toHex = (bytes) => Buffer.from(bytes).toString('hex')

export const useCardano = () => {
  const cardanoContext = useContext(CardanoContext)

  return cardanoContext
}
