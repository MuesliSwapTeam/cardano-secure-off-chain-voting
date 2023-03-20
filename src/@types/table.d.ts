import 'react-table'

declare module 'react-table' {
  export interface UseTableRowProps {
    isExpanded: boolean
    canExpand: boolean
    toggleRowExpanded: () => void
  }
}
