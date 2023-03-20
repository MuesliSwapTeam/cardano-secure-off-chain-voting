import { matchPath, useLocation, To } from 'react-router-dom'

interface Arg {
  routes: Array<{ to: To }>
}

export default function useMatchPaths({ routes }: Arg) {
  const { pathname } = useLocation()

  return routes.find(({ to }) => {
    const pattern = typeof to === 'string' ? to : to.pathname

    return !!matchPath(pattern, pathname)
  })
}
