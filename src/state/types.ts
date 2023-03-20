export type PolicyId = string
export type TokenName = string

export interface TokenAddress {
  readonly policyId: PolicyId
  readonly name: TokenName
}
