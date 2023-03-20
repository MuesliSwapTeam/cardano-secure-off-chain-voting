import { LinkType } from 'components/Header/types'

const LINKS: LinkType[] = [
  {
    to: '/',
    name: 'Home',
  },
].map((item, i) => ({ ...item, id: i }))

export default LINKS
