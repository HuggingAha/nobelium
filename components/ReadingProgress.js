import { useEffect, useState } from 'react'

const ReadingProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      // 避免在页面加载完成前或内容不足一屏时出现除以0的情况
      const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0
      setScrollProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', handleScroll)
    // 初始计算一次，确保刷新页面时进度条位置正确
    handleScroll() 

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    // [修改] 将组件固定在页面顶部
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-transparent">
      <div
        className="h-full bg-primary-500 transition-all duration-100 ease-linear"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  )
}

export default ReadingProgress
