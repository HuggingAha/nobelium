import Link from 'next/link'
import { useConfig } from '@/lib/config'
import { useLocale } from '@/lib/locale'
import { useState } from 'react'

const Pagination = ({ page, showNext, totalPages }) => {
  const BLOG = useConfig()
  const locale = useLocale()
  const currentPage = +page
  const [jumpPage, setJumpPage] = useState('')

  // Calculate total pages based on showNext for backward compatibility
  const calculatedTotalPages = totalPages || (showNext ? currentPage + 1 : currentPage)

  // Generate page numbers to display
  const generatePages = () => {
    const pages = []
    const maxVisiblePages = 7
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(calculatedTotalPages, startPage + maxVisiblePages - 1)

    // Adjust start page if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    // Add ellipsis and first page if needed
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push('...')
      }
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Add ellipsis and last page if needed
    if (endPage < calculatedTotalPages) {
      if (endPage < calculatedTotalPages - 1) {
        pages.push('...')
      }
      pages.push(calculatedTotalPages)
    }

    return pages
  }

  const handleJump = (e) => {
    e.preventDefault()
    const pageNum = parseInt(jumpPage)
    if (pageNum && pageNum >= 1 && pageNum <= calculatedTotalPages) {
      if (pageNum === 1) {
        window.location.href = BLOG.path || '/'
      } else {
        window.location.href = `/page/${pageNum}`
      }
    }
  }

  const pages = generatePages()

  return (
    <div className="flex flex-col items-center space-y-6 mt-12 mb-12">
      {/* Page Numbers */}
      <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-2">
        {/* Previous Button */}
        {currentPage > 1 && (
          <Link
            href={
              currentPage - 1 === 1
                ? `${BLOG.path || '/'}`
                : `/page/${currentPage - 1}`
            }
            className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hover:shadow-sm"
          >
            ← {locale.PAGINATION.PREV}
          </Link>
        )}

        {/* Page Numbers */}
        {pages.map((pageNum, index) => (
          <div key={index}>
            {pageNum === '...' ? (
              <span className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
                ...
              </span>
            ) : pageNum === currentPage ? (
              <span className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md shadow-md">
                {pageNum}
              </span>
            ) : (
              <Link
                href={pageNum === 1 ? `${BLOG.path || '/'}` : `/page/${pageNum}`}
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hover:shadow-sm"
              >
                {pageNum}
              </Link>
            )}
          </div>
        ))}

        {/* Next Button */}
        {currentPage < calculatedTotalPages && (
          <Link
            href={`/page/${currentPage + 1}`}
            className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors hover:shadow-sm"
          >
            {locale.PAGINATION.NEXT} →
          </Link>
        )}
      </div>

      {/* Page Info */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {locale.PAGINATION.PAGE?.replace('{page}', currentPage).replace('{total}', calculatedTotalPages) || `第 ${currentPage} 页 / 共 ${calculatedTotalPages} 页`}
      </div>

      {/* Jump to Page */}
      {calculatedTotalPages > 1 && (
        <form onSubmit={handleJump} className="flex items-center space-x-2">
          <input
            type="number"
            min="1"
            max={calculatedTotalPages}
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            placeholder={locale.PAGINATION.JUMP_PLACEHOLDER || '页码'}
            className="w-16 px-2 py-1 text-sm text-center border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          <button
            type="submit"
            className="px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            {locale.PAGINATION.JUMP || '跳转'}
          </button>
        </form>
      )}
    </div>
  )
}

export default Pagination
