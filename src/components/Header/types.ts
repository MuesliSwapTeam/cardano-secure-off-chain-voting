import { To } from 'react-router-dom'

export type RouteType = {
  name: string
  to: To
  id: string
  new?: boolean
  external?: boolean
}

export type LinkType = {
  name: string
  id: number
  new?: boolean
  external?: boolean
} & ({ to: To } | { routes: RouteType[] })
