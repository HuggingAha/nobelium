import PropTypes from 'prop-types'
import { getPageTableOfContents } from 'notion-utils'
import cn from 'classnames'
// [新增] 导入自定义Hook和React Hooks
import { useScrollSpy } from '@/lib/hooks/useScrollSpy'
import { useEffect, useState } from 'react'

export default function TableOfContents ({ blockMap, className, style }) {
  const collectionId = Object.keys(blockMap.collection)[0]
  const page = Object.values(blockMap.block).find(block => block.value.parent_id === collectionId)?.value
  const nodes = getPageTableOfContents(page, blockMap)

  // [新增] 1. 获取所有标题的ID，并为其添加前缀以匹配Notion渲染器的ID格式
  const [headingIds, setHeadingIds] = useState([])
  useEffect(() => {
    if (nodes.length > 0 && typeof window !== 'undefined') {
      // Notion-utils gives raw IDs, but react-notion-x renders them with a prefix.
      // We also need to add the IDs to the actual DOM elements for the observer to find them.
      const ids = nodes.map(node => {
        const sanitizedId = `notion-block-${node.id.replaceAll('-', '')}`
        const headingEl = document.querySelector(`.notion-h[data-block-id="${node.id}"]`)
        if (headingEl) {
          headingEl.id = sanitizedId;
        }
        return sanitizedId
      })
      setHeadingIds(ids)
    }
  }, [nodes])

  // [新增] 2. 使用Hook监听滚动，获取当前激活的标题ID
  const activeId = useScrollSpy(headingIds)

  if (!nodes.length) return null

  /**
   * @param {string} id - The ID of target heading block (could be in UUID format)
   */
  function scrollTo (id) {
    id = id.replaceAll('-', '')
    const target = document.querySelector(`.notion-block-${id}`)
    if (!target) return
    // `80` is a bit more than the height of the sticky nav to give some space
    const top = window.scrollY + target.getBoundingClientRect().top - 80
    window.scrollTo({
      top,
      behavior: 'smooth'
    })
  }

  return (
    // [修改] 为根元素添加样式，并处理长目录的滚动问题
    <aside
      className={cn('p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide', className)}
      style={style}
    >
      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4 tracking-wide">
        ON THIS PAGE
      </h4>
      <nav className="space-y-1">
        {nodes.map(node => {
          const sanitizedId = `notion-block-${node.id.replaceAll('-', '')}`
          // [修改] 判断当前项是否为激活项
          const isActive = activeId === sanitizedId

          return (
            <a
              key={node.id}
              href={`#${sanitizedId}`}
              onClick={(e) => {
                e.preventDefault()
                scrollTo(node.id)
              }}
              // [修改] 根据激活状态动态添加样式
              className={cn(
                'block py-1 text-sm transition-all duration-150 border-l-2',
                isActive
                  ? 'text-primary-600 dark:text-primary-400 border-primary-500 font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              )}
              style={{ paddingLeft: `${12 + node.indentLevel * 16}px` }}
            >
              {node.text}
            </a>
          )
        })}
      </nav>
    </aside>
  )
}

TableOfContents.propTypes = {
  blockMap: PropTypes.object.isRequired,
  className: PropTypes.string,
  style: PropTypes.object
}
