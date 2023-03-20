import { ReactComponent as EarlyAccess } from './Access.svg'
import AdaHandleLogo from './Adahandle.webp'
import { ReactComponent as Bowl } from './Bowl.svg'
import CardanoLogo from './Cardano.webp'
import coinOne from './coin_1.svg'
import coinTwo from './coin_2.svg'
import coinThree from './coin_3.svg'
import coinFour from './coin_4.svg'
import DefiYield from './DefiYield.webp'
import { ReactComponent as FlowerField } from './Field.svg'
import flowers from './Flowers.svg'
import { ReactComponent as MatrixDark } from './MatrixDark.svg'
import { ReactComponent as MatrixLight } from './MatrixLight.svg'
import { ReactComponent as Milk } from './Milk.svg'
import { ReactComponent as PriorityTrading } from './Priority.svg'
import { ReactComponent as Staking } from './Stacking.svg'
import swap from './Swap.webp'
import { ReactComponent as Voting } from './Voting.svg'
import WorldMobileLogo from './WorldMobileToken.webp'

export { FlowerField, Milk, PriorityTrading, Voting, Staking, EarlyAccess, MatrixLight, MatrixDark, Bowl }

export default {
  cardano: {
    name: 'Cardano Logo',
    src: CardanoLogo,
  },
  adahandle: {
    name: 'AdaHandle Logo',
    src: AdaHandleLogo,
  },
  worldMobileToken: {
    name: 'WorldMobileToken Logo',
    src: WorldMobileLogo,
  },
  defiYield: {
    name: 'DefiYield Logo',
    src: DefiYield,
  },
  coinOne: {
    name: 'First Coin',
    src: coinOne,
  },
  coinTwo: {
    name: 'Second Coin',
    src: coinTwo,
  },
  coinThree: {
    name: 'Third Coin',
    src: coinThree,
  },
  coinFour: {
    name: 'Fourth Coin',
    src: coinFour,
  },
  swap: {
    name: 'Swap',
    src: swap,
  },
  flowers: {
    name: 'Milk Flowers',
    src: flowers,
  },
} as const
