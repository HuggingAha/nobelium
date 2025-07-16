import { useEffect, useState } from 'react'

const ReadingProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [readingTime, setReadingTime] = useState('00:00')

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(Math.min(progress, 100))

      // Calculate estimated reading time based on scroll position
      const totalWords = document.querySelector('article')?.textContent?.split(/\s+/).length || 0
      const wordsPerMinute = 200
      const totalMinutes = Math.ceil(totalWords / wordsPerMinute)
      const currentMinutes = Math.floor((progress / 100) * totalMinutes)
      const remainingMinutes = Math.max(0, totalMinutes - currentMinutes)
      
      setReadingTime(`${remainingMinutes}min`)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial calculation

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="space-y-2">
      <div className="h-0.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gray-400 dark:bg-gray-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>阅读进度</span>
        <span className="tabular-nums">{readingTime}</span>
      </div>
    </div>
  )
}

export default ReadingProgress