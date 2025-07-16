import { useEffect, useState } from 'react'

const ReadingProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          进度
        </span>
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {Math.round(scrollProgress)}%
        </span>
      </div>
      <div className="relative h-1 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div 
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-gray-400 to-gray-600 dark:from-gray-500 dark:to-gray-300 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
    </div>
  )
}

export default ReadingProgress