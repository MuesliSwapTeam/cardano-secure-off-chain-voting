import { fromAscii, fromHex, toHex } from 'cardano/helpers/utils.js'
import { assetsToValue, createOutput, initTx } from 'cardano/pool-creation/base'
import { FACTORY_MINT_SCRIPT, LP_TOKEN_MINT_SCRIPT, POOL_NFT_MINT_SCRIPT } from 'cardano/pool-creation/constants'
import MultiPlatformLoader from 'cardano/pool-creation/loader.js'

export const cardanoInit = async () => {
  await MultiPlatformLoader.load()
}

export async function getPoolTokenName(txHash, txId) {
  // Get all utxos from enterprise address and send them to basic address
  var utxosUrl = `https://api.muesliswap.com/chain/pool-creation-id?ref-hash=${txHash}&ref-idx=${txId}`
  var response = await fetch(utxosUrl)
  const responseHash = await response.text()
  return responseHash
}

export async function create_liquidity_pool(wallet) {
  const { txBuilder, datums, metadata } = await initTx()

  const walletAddress = MultiPlatformLoader.Cardano.BaseAddress.from_address(
    MultiPlatformLoader.Cardano.Address.from_bytes(fromHex((await wallet.getUsedAddresses())[0])),
  )

  const emptyRequiredSigners = MultiPlatformLoader.Cardano.Ed25519KeyHashes.new()
  // get general tokenName
  const tokenName = 'd6ce2b5b713c0b9c9ba498a6c23d9dd92e168e043239b8d5226162c713149a4c' // getPoolTokenName('93e5edca3ea8f7417f8c298e155d6ad865d38eed546b35aa8038e8f0360e707b', '0')

  // mint pool token
  const poolTokenAssets = MultiPlatformLoader.Cardano.MintAssets.new()
  const poolToken = MultiPlatformLoader.Cardano.AssetName.new(fromHex(tokenName))
  poolTokenAssets.insert(poolToken, MultiPlatformLoader.Cardano.Int.new_i32(0))

  const poolTokenMintBuilder = MultiPlatformLoader.Cardano.SingleMintBuilder.new(poolTokenAssets)
  const poolPlutusWitness = MultiPlatformLoader.Cardano.PlutusScriptWitness.from_script(POOL_NFT_MINT_SCRIPT())

  const poolMintPlutusWitness = MultiPlatformLoader.Cardano.PartialPlutusWitness.new(
    poolPlutusWitness,
    MultiPlatformLoader.Cardano.PlutusData.new_list(MultiPlatformLoader.Cardano.PlutusList.new()),
  )

  const poolMintResult = poolTokenMintBuilder.plutus_script(poolMintPlutusWitness, emptyRequiredSigners)
  //txBuilder.add_mint(poolMintResult)

  // mint factory token
  const factoryMintAsstes = MultiPlatformLoader.Cardano.MintAssets.new()
  const factoryToken = MultiPlatformLoader.Cardano.AssetName.new(fromHex(fromAscii('MuesliSwap_AMM')))
  factoryMintAsstes.insert(factoryToken, MultiPlatformLoader.Cardano.Int.new_i32(0))

  const factoryMintBuilder = MultiPlatformLoader.Cardano.SingleMintBuilder.new(factoryMintAsstes)
  const factoryPlutusWitness = MultiPlatformLoader.Cardano.PlutusScriptWitness.from_script(FACTORY_MINT_SCRIPT())

  const constrPlutusData = MultiPlatformLoader.Cardano.ConstrPlutusData.new(
    MultiPlatformLoader.Cardano.BigNum.from_str('0'),
    MultiPlatformLoader.Cardano.PlutusList.new(),
  )
  const partialFactorMintPlutusWitness = MultiPlatformLoader.Cardano.PartialPlutusWitness.new(
    factoryPlutusWitness,
    MultiPlatformLoader.Cardano.PlutusData.new_constr_plutus_data(constrPlutusData),
  )

  const factoryMintResult = factoryMintBuilder.plutus_script(partialFactorMintPlutusWitness, emptyRequiredSigners)

  txBuilder.add_mint(factoryMintResult)

  // mint LP Tokens
  const lpTokensAssets = MultiPlatformLoader.Cardano.MintAssets.new()
  const lpToken = MultiPlatformLoader.Cardano.AssetName.new(fromHex(tokenName))
  lpTokensAssets.insert(lpToken, MultiPlatformLoader.Cardano.Int.new_i32(0))

  const lpTokenMintBuilder = MultiPlatformLoader.Cardano.SingleMintBuilder.new(lpTokensAssets)
  const lpPlutusWitness = MultiPlatformLoader.Cardano.PlutusScriptWitness.from_script(LP_TOKEN_MINT_SCRIPT())

  const lpMintPlutusWitness = MultiPlatformLoader.Cardano.PartialPlutusWitness.new(
    lpPlutusWitness,
    MultiPlatformLoader.Cardano.PlutusData.new_list(MultiPlatformLoader.Cardano.PlutusList.new()),
  )

  const lpMintResult = lpTokenMintBuilder.plutus_script(lpMintPlutusWitness, emptyRequiredSigners)
  // txBuilder.add_mint(lpMintResult)

  const utxos = (await wallet.getUtxos()).map((utxo) =>
    MultiPlatformLoader.Cardano.TransactionUnspentOutput.from_bytes(fromHex(utxo)),
  )

  utxos.forEach((utxo) => {
    const inputBuilder = MultiPlatformLoader.Cardano.SingleInputBuilder.new(utxo.input(), utxo.output()).payment_key()
    txBuilder.add_input(inputBuilder)
  })

  // add output
  const assets = []

  // policy id for pool token
  /*
  assets.push({
    unit: '909133088303c49f3a30f1cc8ed553a73857a29779f6c6561cd8093f' + tokenName,
    quantity: '0',
  })

  // policy id for liquidity pool token
  assets.push({
    unit: 'af3d70acf4bd5b3abb319a7d75c89fb3e56eafcdd46b2e9b57a2557f' + tokenName,
    quantity: '0',
  })

  // policy id for factory token
  assets.push({
    unit: 'de9b756719341e79785aa13c164e7fe68c189ed04d61c9876b2fe53f' + fromAscii('MuesliSwap_AMM'),
    quantity: '0',
  })
  */
  assets.push({ unit: 'lovelace', quantity: '1500000' })

  const output = createOutput(walletAddress.to_address(), assetsToValue(assets), undefined, undefined)
  const outputResult = MultiPlatformLoader.Cardano.SingleOutputBuilderResult.new(output)
  txBuilder.add_output(outputResult)

  const signedTxBuilder = txBuilder.build(0, walletAddress.to_address())

  const unsignedTxCBOR = toHex(signedTxBuilder.build_unchecked().to_bytes())
}
