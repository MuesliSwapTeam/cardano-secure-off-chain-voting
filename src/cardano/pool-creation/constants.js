import MultiPlatformLoader from 'cardano/pool-creation/loader'
import { contract as lp_minting_contract } from 'cardano/pool-creation/scripts/lp_minting'
import { contract as factory_minting_contract } from 'cardano/pool-creation/scripts/factory_minting'
import { contract as pool_minting_contract } from 'cardano/pool-creation/scripts/pool_minting'
import { fromHex } from 'cardano/helpers/utils.js'

/*
  LIQUIDITY
*/
export const FACTORY_MINT_SCRIPT = () => {
  const plutusV2Script = MultiPlatformLoader.Cardano.PlutusV2Script.new(fromHex(factory_minting_contract))
  const plutusScript = MultiPlatformLoader.Cardano.PlutusScript.from_v2(plutusV2Script)
  return plutusScript
}

export const POOL_NFT_MINT_SCRIPT = () => {
  const plutusV2Script = MultiPlatformLoader.Cardano.PlutusV2Script.new(fromHex(lp_minting_contract))
  const plutusScript = MultiPlatformLoader.Cardano.PlutusScript.from_v2(plutusV2Script)
  return plutusScript
}

export const LP_TOKEN_MINT_SCRIPT = () => {
  const plutusV2Script = MultiPlatformLoader.Cardano.PlutusV2Script.new(fromHex(pool_minting_contract))
  const plutusScript = MultiPlatformLoader.Cardano.PlutusScript.from_v2(plutusV2Script)
  return plutusScript
}
