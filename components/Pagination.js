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
    <div className="flex justify-center items-center mt-12 mb-12">
      <div className="flex items-center space-x-2 bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm rounded-full px-3 py-2 border border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <!-- 上一页 -->
        {currentPage > 1 ? (
          <Link
            href={currentPage - 1 === 1 ? `${BLOG.path || '/'}` : `/page/${currentPage - 1}`}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            title="上一页"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
        ) : (
          <span className="p-1.5 text-gray-300 dark:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </span>
        )}

        <!-- 页码 -->
        <div className="flex items-center space-x-1">
          {pages.map((pageNum, index) => (
            <div key={index}>
              {pageNum === '...' ? (
                <span className="px-1 text-xs text-gray-400 dark:text-gray-600">...</span>
              ) : pageNum === currentPage ? (
                <div className="relative">
                  <span className="px-2.5 py-1 text-xs font-medium text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-800 rounded-full">
                    {pageNum}
                  </span>
                  <!-- 页码输入框 -->
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                    <form onSubmit={handleJump} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-200 dark:border-gray-700">
                      <input
                        type="number"
                        min="1"
                        max={calculatedTotalPages}
                        value={jumpPage}
                        onChange={(e) => setJumpPage(e.target.value)}
                        onFocus={(e) => e.target.select()}
                        className="w-12 px-2 py-1 text-xs text-center border-0 bg-transparent focus:outline-none focus:ring-0 dark:text-white"
                        placeholder={currentPage.toString()}
                      />
                    </form>
                  </div>
                </div>
              ) : (
                <Link
                  href={pageNum === 1 ? `${BLOG.path || '/'}` : `/page/${pageNum}`}
                  className="px-2.5 py-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  {pageNum}
                </Link>
              )}
            </div>
          ))}
        </div>

        <!-- 页码信息 -->
        <div className="px-2 text-xs text-gray-500 dark:text-gray-400 border-l border-gray-200 dark:border-gray-700">
          {currentPage}/{calculatedTotalPages}
        </div>

        <!-- 下一页 -->
        {currentPage < calculatedTotalPages ? (
          <Link
            href={`/page/${currentPage + 1}`}
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            title="下一页"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <span className="p-1.5 text-gray-300 dark:text-gray-600">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        )}

        <!-- 快速跳转 -->
        <div className="group relative">
          <button
            type="button"
            className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            title="跳转到指定页"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </button>
          
          <div className="absolute top-full right-0 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10"
            onMouseEnter={(e) => e.currentTarget.classList.remove('opacity-0', 'invisible')}
            onMouseLeave={(e) => e.currentTarget.classList.add('opacity-0', 'invisible')}
          >
            <form onSubmit={handleJump} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border border-gray-200 dark:border-gray-700"
              onSubmit={(e) => {
                e.preventDefault()
                const pageNum = parseInt(jumpPage)
                if (pageNum && pageNum >= 1 && pageNum <= calculatedTotalPages) {
                  handleJump(e)
                }
              }}
            >
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="1"
                  max={calculatedTotalPages}
                  value={jumpPage}
                  onChange={(e) => setJumpPage(e.target.value)}
                  onFocus={(e) => e.target.select()}
                  className="w-12 px-2 py-1 text-xs text-center border-0 bg-transparent focus:outline-none focus:ring-0 dark:text-white"
                  placeholder="页码"
                />
                <button
                  type="submit"
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  跳
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pagination
