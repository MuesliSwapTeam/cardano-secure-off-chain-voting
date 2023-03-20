import { createContext } from 'react'
import Mode from './Mode'

interface ContextValue {
  mode: Mode
  toggleMode(): void
}

export default createContext<ContextValue | undefined>(undefined)
