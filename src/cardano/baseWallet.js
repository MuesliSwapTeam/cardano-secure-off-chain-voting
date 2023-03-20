import Loader from 'cardano/helpers/loader.js'
import { assetsToValue, fromHex, toHex, valueToAssets } from 'cardano/helpers/utils.js'

const HUNGRY_COW_POLICY_ID = '11ebbfbfd62985cbae7330b95488b9dcf17ecb5e728442031362ad81'

export const cardanoInit = async () => {
  await Loader.load()
}

function include(file) {
  var script = document.createElement('script')
  script.src = file
  script.type = 'text/javascript'
  script.defer = true

  document.getElementsByTagName('head').item(0).appendChild(script)
}

export async function getWalletAddress(wallet) {
  const walletAddress = Loader.Cardano.Address.from_bytes(fromHex((await wallet.getUsedAddresses())[0]))

  const bechAddress = walletAddress.to_bech32()
  return bechAddress
}

export async function getAdaBalance(wallet) {
  if (!wallet) {
    return 0
  }
  const valueHex = await wallet.getBalance()
  const value = Loader.Cardano.Value.from_bytes(fromHex(valueHex))
  const lovelace = parseFloat(value.coin().to_str()) / 1000000
  return lovelace
}

export async function getAllTokenBalances(wallet) {
  if (!wallet) {
    return {}
  }
  const valueHex = await wallet.getBalance()
  const value = Loader.Cardano.Value.from_bytes(fromHex(valueHex))

  const assets = valueToAssets(value)
  return assets
}

export async function getTokenBalance(wallet, policyId, tokenName) {
  if (!wallet) {
    return ''
  }

  const valueHex = await wallet.getBalance()
  const value = Loader.Cardano.Value.from_bytes(fromHex(valueHex))
  if (!value.multiasset()) {
    return '0'
  }

  const scriptHashPolicyId = Loader.Cardano.ScriptHash.from_bytes(fromHex(policyId))
  const policy = value.multiasset().get(scriptHashPolicyId)

  if (policy) {
    const assetName = Loader.Cardano.AssetName.new(fromHex(tokenName))
    const quantity = policy.get(assetName)
    return quantity ? quantity.to_str() : '0'
  }
  return '0'
}

export async function getHungryCows(wallet) {
  if (!wallet) {
    return undefined
  }

  const valueHex = await wallet.getBalance()
  const value = Loader.Cardano.Value.from_bytes(fromHex(valueHex))
  if (!value.multiasset()) {
    return undefined
  }

  const scriptHashPolicyId = Loader.Cardano.ScriptHash.from_bytes(fromHex(HUNGRY_COW_POLICY_ID))
  const policy = value.multiasset().get(scriptHashPolicyId)

  if (policy) {
    let names = []

    for (let i = 0; i < policy.keys().len(); i++) {
      names.push(new TextDecoder().decode(policy.keys().get(i).name()))
    }

    // which order should we define?
    names.sort(function (a, b) {
      return (
        a.length - b.length || // sort by length, if equal then
        a.localeCompare(b)
      ) // sort by dictionary order
    })
    return names
  }

  return undefined
}

export async function getAdaHandles(wallet) {
  if (!wallet) {
    return undefined
  }

  const valueHex = await wallet.getBalance()
  const value = Loader.Cardano.Value.from_bytes(fromHex(valueHex))
  if (!value.multiasset()) {
    return undefined
  }

  const scriptHashPolicyId = Loader.Cardano.ScriptHash.from_bytes(
    fromHex('f0ff48bbb7bbe9d59a40f1ce90e9e9d0ff5002ec48f232b49ca0fb9a'),
  )
  const policy = value.multiasset().get(scriptHashPolicyId)

  if (policy) {
    let names = []

    for (let i = 0; i < policy.keys().len(); i++) {
      names.push(new TextDecoder().decode(policy.keys().get(i).name()))
    }

    // which order should we define?
    names.sort(function (a, b) {
      return (
        a.length - b.length || // sort by length, if equal then
        a.localeCompare(b)
      ) // sort by dictionary order
    })
    return names
  }

  return undefined
}

export async function getPublicKeyHash(address) {
  const walletAddress = Loader.Cardano.BaseAddress.from_address(Loader.Cardano.Address.from_bytes(fromHex(address)))

  if (!walletAddress) {
    return undefined
  }

  var oCreator = walletAddress.payment_cred().to_keyhash().to_bytes()
  oCreator = toHex(oCreator)

  return oCreator
}

export const getMintedTokens = async (assetIdentifier) => {
  const reply = await blockfrostRequest(`/assets/${assetIdentifier}`)

  if (reply?.quantity) {
    return reply?.quantity
  }

  return undefined
}

export async function getOwnCollateral(wallet) {
  // remove all utxos that are used as inputs for actual tx
  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  var potentialUtxos = utxos
    .filter((x) => !x.output().amount().multiasset()) // filter out multiassets
    .filter((x) => Number(x.output().amount().coin().to_str()) < 1e7) // filter out utxos above 10 ADA
    .filter((x) => Number(x.output().amount().coin().to_str()) >= 2.5e6) // filter out utxos below 2.5 ADA

  if (potentialUtxos.length === 0) {
    return []
  }

  var minimumUtxos = potentialUtxos.reduce(function (utxo1, utxo2) {
    var value1 = Number(utxo1.output().amount().coin().to_str())
    var value2 = Number(utxo2.output().amount().coin().to_str())
    return value1 < value2 ? utxo1 : utxo2
  })

  return [toHex(minimumUtxos.to_bytes())]
}

export async function setOwnCollateral(wallet) {
  const { txBuilder, datums, metadata, outputs } = await initTx()

  const walletAddress = Loader.Cardano.Address.from_bytes(fromHex((await wallet.getUsedAddresses())[0]))

  const baseAddress = Loader.Cardano.BaseAddress.from_address(walletAddress)

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    Loader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  var collateralOutput = createOutput(
    walletAddress,
    assetsToValue([
      {
        unit: 'lovelace',
        quantity: '5000000',
      },
    ]),
    null,
    null,
  )
  outputs.add(collateralOutput)

  return finalizeTX(wallet, txBuilder, baseAddress, utxos, outputs, datums, {}, null, null, null, false)
}
