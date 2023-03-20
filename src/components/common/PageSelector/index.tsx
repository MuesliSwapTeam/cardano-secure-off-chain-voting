import Pagination from './Pagination'
import PerPageSelector from './PerPageSelector'
import { StyledTableFooter } from './styled'

export default function PageSelector({ perPage, setPerPage, page, setPage, totalPages }) {
  return (
    <StyledTableFooter title="Page Navigation">
      <PerPageSelector perPage={perPage} setPerPage={setPerPage} setPage={setPage} />

      <Pagination count={totalPages} page={page} onChange={setPage} />
    </StyledTableFooter>
  )
}
