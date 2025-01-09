import { FC, useMemo } from 'react'
import { PaginationProps } from '@/src/types/pagination'
import { isCurrentPage, usePagination } from '@/src/common/hooks/usePagination'
import PaginationButton from './PaginationButton'
import PaginationSideButtons from './PaginationSideButton'

const Pagination: FC<PaginationProps> = ({
  totalItems,
  pageSize = 1,
  pagesToDisplay = 3,
  onPageChange,
  showLastPagesButtons = false,
  currentPage,
  containerStyle = {},
  btnStyle = {},
  textStyle = {},
  activeBtnStyle = null,
  activeTextStyle = null,
}) => {
  const totalPages = useMemo(
    () => Math.ceil(totalItems / pageSize),
    [totalItems, pageSize]
  )
  const pagination = usePagination(
    totalItems,
    pageSize,
    pagesToDisplay,
    currentPage
  )

  const handleChangePage = (page: string) => {
    if (page !== '...') {
      onPageChange(parseInt(page, 10))
    }
  }

  return (
    <PaginationSideButtons
      {...{
        totalPages,
        currentPage,
        handleChangePage,
        showLastPagesButtons,
        containerStyle,
        btnStyle,
        textStyle,
      }}
    >
      {pagination.map((pag, index) => (
        <PaginationButton
          btnStyle={btnStyle}
          textStyle={textStyle}
          activeBtnStyle={activeBtnStyle}
          activeTextStyle={activeTextStyle}
          key={index}
          isActive={isCurrentPage(pag, currentPage)}
          onPress={() => handleChangePage(pag)}
        >
          {pag}
        </PaginationButton>
      ))}
    </PaginationSideButtons>
  )
}

export default Pagination
