import { useMemo } from "react"
interface UsePaginationProps {
  totalCount: number
  pageSize: number
  currentPageIndex: number
  siblingCount?: number
}

interface PaginationResult {
  paginationRange: (number | string)[]
  goToPreviousPage: () => number
  goToNextPage: () => number
  currentPageIndex: number
  numPages: number
}

const range = (start: number, end: number): number[] => {
  let length = end - start + 1
  return Array.from({ length }, (_, idx) => idx + start)
}

const usePagination = ({
  totalCount,
  pageSize,
  currentPageIndex,
  siblingCount = 1,
}: UsePaginationProps): PaginationResult => {
  const numPages = Math.ceil(totalCount / pageSize)
  const ELLIPSIS = "ELLIPSIS"

  // Pages count is determined as siblingCount + firstPage + lastPage + currentPageIndex + 2 * ELLIPSIS
  const totalPageNumbers = siblingCount + 6

  const paginationRange = useMemo(() => {
    /*
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..numPages+1]
    */
    if (totalPageNumbers >= numPages) {
      return range(0, numPages).map((n) => n + 1)
    }

    const leftSiblingIndex = Math.max(currentPageIndex - siblingCount, 0)
    const rightSiblingIndex = Math.min(
      currentPageIndex + siblingCount,
      numPages - 1
    )

    /*
      We do not want to show dots if there is only one position left 
      after/before the left/right page count as that would lead to a change if our Pagination
      component size which we do not want
    */
    const shouldShowLeftDots = leftSiblingIndex > 1
    const shouldShowRightDots = rightSiblingIndex < numPages - 3
    const firstPageIndex = 1
    const lastPageIndex = numPages

    let result: (number | string)[] = []
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftRange = range(1, 3 + 2 * siblingCount)
      result = [...leftRange, ELLIPSIS, lastPageIndex]
    } else if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightRange = range(numPages - (2 + 2 * siblingCount), numPages)
      result = [firstPageIndex, ELLIPSIS, ...rightRange]
    } else if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex + 1, rightSiblingIndex + 1)
      result = [
        firstPageIndex,
        ELLIPSIS,
        ...middleRange,
        ELLIPSIS,
        lastPageIndex,
      ]
    }
    return result
  }, [totalPageNumbers, numPages, currentPageIndex, siblingCount])

  const goToPreviousPage = () => Math.max(currentPageIndex - 1, 1)
  const goToNextPage = () => Math.min(currentPageIndex + 1, numPages)

  return {
    paginationRange,
    goToPreviousPage,
    goToNextPage,
    currentPageIndex,
    numPages,
  }
}

export default usePagination
