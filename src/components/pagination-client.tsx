import * as React from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationButton,
} from "components/pagination"
import usePagination from "hooks/use-pagination"

interface PaginationProps {
  totalCount: number
  pageSize: number
  currentPageIndex: number
  onChangePage: (page: number) => void
  className?: string
}

const PaginationClient: React.FC<PaginationProps> = ({
  totalCount,
  pageSize,
  currentPageIndex,
  onChangePage,
  className,
}) => {
  const { paginationRange } = usePagination({
    totalCount,
    pageSize,
    currentPageIndex,
  })
  console.log("paginationRange", paginationRange)

  return (
    <Pagination className={className} key={currentPageIndex}>
      <PaginationContent>
        {/* <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem> */}
        {paginationRange.map((page, index) => {
          if (page === "ELLIPSIS") {
            return <PaginationEllipsis key={index} />
          }
          return (
            <PaginationItem key={page} data-page={page}>
              <PaginationButton
                //   asChild
                page={page as number}
                onPageChange={onChangePage}
                isActive={currentPageIndex === page}>
                {page}
              </PaginationButton>
            </PaginationItem>
          )
        })}
      </PaginationContent>
    </Pagination>
  )
}

export default PaginationClient
