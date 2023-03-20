import { Buffer } from 'buffer'

import Loader from './loader.js'

export const fromHex = (hex) => Buffer.from(hex, 'hex')
export const toHex = (bytes) => Buffer.from(bytes).toString('hex')
export const toBytesNum = (num) =>
  num
    .toString()
    .split('')
    .map((d) => '3' + d)
    .join('')
export const fromAscii = (hex) => Buffer.from(hex).toString('hex')

export function toAscii(hex) {
  var hex = hex.toString() //force conversion
  var str = ''
  for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  return str
}

export const assetsToValue = (assets) => {
  const multiAsset = Loader.Cardano.MultiAsset.new()
  const lovelace = assets.find((asset) => asset.unit === 'lovelace')
  const policies = [
    ...new Set(assets.filter((asset) => asset.unit !== 'lovelace').map((asset) => asset.unit.slice(0, 56))),
  ]
  policies.forEach((policy) => {
    const policyAssets = assets.filter((asset) => asset.unit.slice(0, 56) === policy)
    const assetsValue = Loader.Cardano.Assets.new()
    policyAssets.forEach((asset) => {
      assetsValue.insert(
        Loader.Cardano.AssetName.new(Buffer.from(asset.unit.slice(56), 'hex')),
        Loader.Cardano.BigNum.from_str(asset.quantity),
      )
    })
    multiAsset.insert(Loader.Cardano.ScriptHash.from_bytes(Buffer.from(policy, 'hex')), assetsValue)
  })
  const value = Loader.Cardano.Value.new(Loader.Cardano.BigNum.from_str(lovelace ? lovelace.quantity : '0'))
  if (assets.length > 1 || !lovelace) value.set_multiasset(multiAsset)
  return value
}

export const valueToAssets = (value) => {
  const assets = {}
  assets['lovelace'] = parseInt(value.coin().to_str())
  if (value.multiasset()) {
    const multiAssets = value.multiasset().keys()
    for (let j = 0; j < multiAssets.len(); j++) {
      const policy = multiAssets.get(j)
      const policyAssets = value.multiasset().get(policy)
      const assetNames = policyAssets.keys()
      for (let k = 0; k < assetNames.len(); k++) {
        const policyAsset = assetNames.get(k)
        const quantity = policyAssets.get(policyAsset)
        const asset =
          Buffer.from(policy.to_bytes(), 'hex').toString('hex') +
          '.' +
          Buffer.from(policyAsset.name(), 'hex').toString('hex')
        assets[asset] = parseInt(quantity.to_str())
      }
    }
  }
  return assets
}
