import { PolicyId, TokenAddress, TokenName } from '../state/types'

export function toHex(s: string): string {
  return Buffer.from(s).toString('hex').toLowerCase()
}

export function fromHex(s: string): string {
  return Buffer.from(s, 'hex').toString()
}

export function getDisplayName(addr: TokenAddress): string {
  return fromHex(addr.name)
}

export function fromTokenAddress(addr: TokenAddress): string {
  return `${addr.policyId}.${addr.name}`
}

export function toTokenAddress(arg0: string, arg1: TokenName = undefined, isHex = true): TokenAddress {
  let policyId: PolicyId = ''
  let name: TokenName = ''

  if (arg1 !== undefined) {
    // if arg1 is defined we have a policyId, tokenName input pair
    policyId = arg0
    name = isHex ? arg1 : Buffer.from(arg1).toString('hex')
  } else if (arg0 !== '.') {
    // otherwise we assume, that we get an address (i.e. policyId.tokenName)
    policyId = arg0.substring(0, 56)
    name = arg0.substring(57)
    if (!isHex) name = Buffer.from(name).toString('hex')
  }

  return {
    policyId,
    name,
  }
}

export function isAda(addr: TokenAddress): boolean {
  return addr && addr.name === '' && addr.policyId === ''
}

export function equalsAddress(a: TokenAddress, b: TokenAddress): boolean {
  return a.policyId === b.policyId && a.name === b.name
}
