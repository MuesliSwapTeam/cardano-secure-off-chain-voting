// eslint-disable-next-line import/extensions
import WhitePaperPdf from 'assets/whitepaper.pdf'

type FooterLink = {
  to: string
  name: string
  id: number
  external: boolean
}

type Column = {
  column_name: string
  id: number
  links: FooterLink[]
}

const FOOTER_COLUMNS: Column[] = [
  {
    column_name: 'Company',
    links: [
      {
        name: 'News',
        to: 'https://medium.com/@muesliswap',
        external: true,
      },
      {
        name: 'Docs',
        to: 'https://docs.muesliswap.com',
        external: true,
      },
      /* {
        name: 'Impressum',
        to: 'impressum/',
        external: false,
      }, */
    ].map((item, i) => ({ ...item, id: i })),
  },
  {
    column_name: 'Community',
    links: [
      {
        name: 'Discord',
        to: 'https://discord.com/invite/vHzSXRWBJR',
        external: true,
      },
      {
        name: 'Reddit',
        to: 'https://www.reddit.com/r/MuesliSwapADA/',
        external: true,
      },
      {
        name: 'Twitter',
        to: 'https://twitter.com/MuesliSwapTeam',
        external: true,
      },
      {
        name: 'Telegram',
        to: 'https://t.me/muesliswapADA',
        external: true,
      },
    ].map((item, i) => ({ ...item, id: i })),
  },
  {
    column_name: 'Developers',
    links: [
      {
        name: 'Github',
        to: 'https://github.com/MuesliSwapTeam',
        external: true,
      },
      {
        name: 'Whitepaper',
        to: WhitePaperPdf,
        external: true,
      },
      {
        name: 'Audits',
        to: 'https://github.com/mlabs-haskell/muesliswap-audit-public/blob/master/MuesliSwap-audit-report.pdf',
        external: true,
      },
    ].map((item, i) => ({ ...item, id: i })),
  },
].map((item, i) => ({ ...item, id: i }))

export default FOOTER_COLUMNS
