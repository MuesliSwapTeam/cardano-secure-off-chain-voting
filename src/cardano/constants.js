import Loader from 'cardano/helpers/loader.js'
import { fromHex } from 'cardano/helpers/utils.js'
import { contract_v2 as minswap } from 'cardano/plutus_scripts/minswap.js'
import { contract as muesli_batcher_v1, contractPlutusV2 as muesli_batcher_v2 } from 'cardano/plutus_scripts/muesliAmm'
import {
  contract_staking as staking,
  farming as farming,
  myield_staking as myield_staking,
} from 'cardano/plutus_scripts/muesliStaking.js'
import {
  contract as orderbook_plutus_v1,
  plutusV2contract as orderbook_plutus_v2,
  plutusV2Optimized as orderbook_plutus_v2_optimized,
} from 'cardano/plutus_scripts/muesliv2.js'
import { contract as sundaeswap } from 'cardano/plutus_scripts/sundae.js'
import { contract as wingriders } from 'cardano/plutus_scripts/wingriders.js'
import { contract as indigo_farming_contract } from 'cardano/plutus_scripts/indigo.js'
import { isMainnet } from 'utils/networkId'

export const ORDERBOOK_PLUTUS_V1_CONTRACT = () => {
  const plutusScript = Loader.Cardano.PlutusScript.new(fromHex(orderbook_plutus_v1))
  return plutusScript
}

export const ORDERBOOK_PLUTUS_V2_CONTRACT = () => {
  const plutusScript = Loader.Cardano.PlutusScript.new_v2(fromHex(orderbook_plutus_v2))
  return plutusScript
}

export const ORDERBOOK_PLUTUS_V2_OPTIMIZED_CONTRACT = () => {
  const plutusScript = Loader.Cardano.PlutusScript.new_v2(fromHex(orderbook_plutus_v2_optimized))
  return plutusScript
}

export const ORDERBOOK_PLUTUS_V1_ADDRESS = () =>
  isMainnet()
    ? Loader.Cardano.Address.from_bech32(
        'addr1z8c7eyxnxgy80qs5ehrl4yy93tzkyqjnmx0cfsgrxkfge27q47h8tv3jp07j8yneaxj7qc63zyzqhl933xsglcsgtqcqxzc2je',
      )
    : Loader.Cardano.Address.from_bech32(
        'addr_test1zrc7eyxnxgy80qs5ehrl4yy93tzkyqjnmx0cfsgrxkfge2ass3v5chkaus2jqa9ld6cjzq8f768ad5xtej6pmvh46jhq5dulx9',
      )

export const ORDERBOOK_PLUTUS_V2_ADDRESS = () =>
  isMainnet()
    ? Loader.Cardano.Address.from_bech32(
        'addr1z8l28a6jsx4870ulrfygqvqqdnkdjc5sa8f70ys6dvgvjqc3r6dxnzml343sx8jweqn4vn3fz2kj8kgu9czghx0jrsyqxyrhvq',
      )
    : Loader.Cardano.Address.from_bech32('addr_test1wrl28a6jsx4870ulrfygqvqqdnkdjc5sa8f70ys6dvgvjqc8vudlr')

export const ORDERBOOK_PLUTUS_V2_OPTIMIZED_ADDRESS = () =>
  isMainnet()
    ? Loader.Cardano.Address.from_bech32(
        'addr1zyq0kyrml023kwjk8zr86d5gaxrt5w8lxnah8r6m6s4jp4g3r6dxnzml343sx8jweqn4vn3fz2kj8kgu9czghx0jrsyqqktyhv',
      )
    : Loader.Cardano.Address.from_bech32('addr_test1wrl28a6jsx4870ulrfygqvqqdnkdjc5sa8f70ys6dvgvjqc8vudlr')

export const ORDERBOOK_REVENUE_ADDRESS = () =>
  isMainnet()
    ? Loader.Cardano.Address.from_bech32(
        'addr1q9ad5mud938r7l24eaac4v57ydlj72hazgprts9f7daaz09mm95jvs5h94099yglxr7v6ug6pp43780huy040lm4utmqx8g5eu',
      )
    : Loader.Cardano.Address.from_bech32(
        'addr_test1qq6nhz7zng2kq0ctw04vg3jn6x7egnvjursde40trpgkfgk6ytznygr2wknzsauwawhk8qn0nkflh6d54356078ye4uqwau0ts',
      )

export const STAKING_ADDRESS = () =>
  isMainnet()
    ? Loader.Cardano.Address.from_bech32('addr1w9u9xvw6aw5tpu3crq74qts54nsr05gk0m8vhxdhgj324tc4mqq3g')
    : Loader.Cardano.Address.from_bech32('addr_test1wpu9xvw6aw5tpu3crq74qts54nsr05gk0m8vhxdhgj324tcwn5u7d') // Testnet address

export const FARMING_ADDRESS = () =>
  isMainnet()
    ? Loader.Cardano.Address.from_bech32('addr1w8p2lkrllqm0vj3qcv7uy5hg2rxa2he3vf7kgqfdp9sg2mc0sz6ay')
    : Loader.Cardano.Address.from_bech32('addr_test1wpu9xvw6aw5tpu3crq74qts54nsr05gk0m8vhxdhgj324tcwn5u7d') // Testnet address
export const STAKING_MYIELD_ADDRESS = () =>
  isMainnet()
    ? Loader.Cardano.Address.from_bech32('addr1w89wq77ksj7t9ch32dtgst02cxmvc7ptqfwuyw4wzp6cgugwa8fj4')
    : Loader.Cardano.Address.from_bech32('addr_test1wpu9xvw6aw5tpu3crq74qts54nsr05gk0m8vhxdhgj324tcwn5u7d') // Testnet address

export const STAKING_FEE_ADDRESS = () =>
  isMainnet()
    ? Loader.Cardano.Address.from_bech32('addr1vxfa8dwzflct4re7qn2ls7t46w6rc479rafnwzqx4z2asuq6cg00t')
    : Loader.Cardano.Address.from_bech32(
        'addr_test1qp3p0lkmg325v45qy7qmwj9ye79yx4v6kh6ewxfuv4tsq8cfvaqurzmttuhhhfa5phrf7yujz44s2nact7whjvy6zzdqy9mjq6',
      )

export const MYIELD_TRANSFORM_ADDRESS = () =>
  isMainnet()
    ? Loader.Cardano.Address.from_bech32('addr1vxg4dazeyyzc40g26ty22uyz5nrnax4gmyfj8m87xl44wvsw3pyfp')
    : Loader.Cardano.Address.from_bech32(
        'addr_test1qp3p0lkmg325v45qy7qmwj9ye79yx4v6kh6ewxfuv4tsq8cfvaqurzmttuhhhfa5phrf7yujz44s2nact7whjvy6zzdqy9mjq6',
      )

export const MVOUCHER_TRANSFORM_ADDRESS = () =>
  isMainnet()
    ? Loader.Cardano.Address.from_bech32('addr1v8h4fm4ejd9w8wr8lkkeu0pe4m00ycl2vysd3jvs9mgw7ps8sm9rt')
    : Loader.Cardano.Address.from_bech32(
        'addr_test1qp3p0lkmg325v45qy7qmwj9ye79yx4v6kh6ewxfuv4tsq8cfvaqurzmttuhhhfa5phrf7yujz44s2nact7whjvy6zzdqy9mjq6',
      )

export const STAKING_CONTRACT = () => {
  const plutusScript = Loader.Cardano.PlutusScript.new(fromHex(staking))
  return plutusScript
}

export const FARMING_CONTRACT = () => {
  const plutusScript = Loader.Cardano.PlutusScript.new(fromHex(farming))
  return plutusScript
}

export const STAKING_MYIELD_CONTRACT = () => {
  const plutusScript = Loader.Cardano.PlutusScript.new(fromHex(myield_staking))
  return plutusScript
}

export const MUESLISWAP_AMM_CONTRACT = () => {
  const plutusScript = Loader.Cardano.PlutusScript.new(fromHex(muesli_batcher_v1))
  return plutusScript
}

export const MUESLISWAP_BATCHER_V2_CONTRACT = () => {
  const plutusScript = Loader.Cardano.PlutusScript.new_v2(fromHex(muesli_batcher_v2))
  return plutusScript
}

export const MUESLISWAP_BATCHER_ADDRESS = () =>
  isMainnet()
    ? Loader.Cardano.Address.from_bech32('addr1wydncknydgqcur8m6s8m49633j8f2hjcd8c2l48cc45yj0s4ta38n')
    : Loader.Cardano.Address.from_bech32('addr_test1wz6gwzfq2luyfrhx7neug3u8q32lq2qvl2vy3tjjmx3mlfshhk6f0') // Testnet address

export const MUESLISWAP_PLUTUS_V2_BATCHER_ADDRESS = () =>
  isMainnet()
    ? Loader.Cardano.Address.from_bech32('addr1w9e7m6yn74r7m0f9mf548ldr8j4v6q05gprey2lhch8tj5gsvyte9')
    : Loader.Cardano.Address.from_bech32('addr_test1wz6gwzfq2luyfrhx7neug3u8q32lq2qvl2vy3tjjmx3mlfshhk6f0') // Testnet address

/*
      SECTION: AGGREGATOR CONSTANTS
*/
export const MINSWAP_PLUTUS_V1_CONTRACT = () => {
  const plutusScript = Loader.Cardano.PlutusScript.new(fromHex(minswap))
  return plutusScript
}
export const MINSWAP_ADDRESS_V2 = () =>
  isMainnet()
    ? Loader.Cardano.Address.from_bech32('addr1wxn9efv2f6w82hagxqtn62ju4m293tqvw0uhmdl64ch8uwc0h43gt')
    : // TODO: use correct MinSwap testnet address
      Loader.Cardano.Address.from_bech32('addr_test1wpu9xvw6aw5tpu3crq74qts54nsr05gk0m8vhxdhgj324tcwn5u7d') // Testnet address

export const WINGRIDERS_PLUTUS_V1_CONTRACT = () => {
  const plutusScript = Loader.Cardano.PlutusScript.new(fromHex(wingriders))
  return plutusScript
}

export const WINGRIDERS_ADDRESS = () =>
  isMainnet()
    ? Loader.Cardano.Address.from_bech32('addr1wxr2a8htmzuhj39y2gq7ftkpxv98y2g67tg8zezthgq4jkg0a4ul4')
    : // TODO: use correct Wingriders testnet address
      Loader.Cardano.Address.from_bech32('addr_test1wpu9xvw6aw5tpu3crq74qts54nsr05gk0m8vhxdhgj324tcwn5u7d') // Testnet address

export const SUNDAESWAP_PLUTUS_V1_CONTRACT = () => {
  const plutusScript = Loader.Cardano.PlutusScript.new(fromHex(sundaeswap))
  return plutusScript
}

export const SUNDAESWAP_ADDRESS = () =>
  isMainnet()
    ? Loader.Cardano.Address.from_bech32('addr1wxaptpmxcxawvr3pzlhgnpmzz3ql43n2tc8mn3av5kx0yzs09tqh8')
    : Loader.Cardano.Address.from_bech32('addr_test1wpu9xvw6aw5tpu3crq74qts54nsr05gk0m8vhxdhgj324tcwn5u7d') // Testnet address

/* LIQUIDITY BOOTSTRAPPING EVENT */

export const LIQUIDITY_BOOTRSTAPPING_ADDRESS = () =>
  Loader.Cardano.Address.from_bech32('addr1v8fhnv2psx7nqgzpyfwfrcgzp95g3ux6v54jytxjr6adhkccxe6k2')

// INDIGO FARMING
export const INDIGIO_FARMING_ADDRESS = () =>
  Loader.Cardano.Address.from_bech32('addr1wygvxm56zhw8ss7y0at6622dpfgc026en9sjwrkf7hfvnycl8qekh')

export const INDIGO_FARMING_CONTRACT = () => {
  const plutusScript = Loader.Cardano.PlutusScript.new_v2(fromHex(indigo_farming_contract))
  return plutusScript
}

export const INDIGO_STAKING_FEE_ADDRESS = () =>
  Loader.Cardano.Address.from_bech32('addr1v9fcrvald5nsm3dc63lcchrra2xckmq9stt0pwkeshd4c5gvwax06')
