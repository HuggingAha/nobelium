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
    <div className="flex justify-center items-center mt-12 mb-12 space-x-1">
      <div className="flex items-center bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-full px-1 py-1 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        {currentPage > 1 && (
          <Link
            href={
              currentPage - 1 === 1
                ? `${BLOG.path || '/'}`
                : `/page/${currentPage - 1}`
            }
            className="p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            ←
          </Link>
        )}

        {pages.map((pageNum, index) => (
          <div key={index} className="flex items-center">
            {pageNum === '...' ? (
              <span className="px-2 text-sm text-gray-400 dark:text-gray-600">... </span>
            ) : pageNum === currentPage ? (
              <span className="px-3 py-1 text-sm font-medium text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 rounded-full">
                {pageNum}
              </span>
            ) : (
              <Link
                href={pageNum === 1 ? `${BLOG.path || '/'}` : `/page/${pageNum}`}
                className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {pageNum}
              </Link>
            )}
          </div>
        ))}

        {currentPage < calculatedTotalPages && (
          <Link
            href={`/page/${currentPage + 1}`}
            className="p-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            →
          </Link>
        )}
      </div>

      <div className="ml-4 text-sm text-gray-500 dark:text-gray-400 tabular-nums">
        {currentPage} / {calculatedTotalPages}
      </div>
    </div>
  )
}

export default Pagination
