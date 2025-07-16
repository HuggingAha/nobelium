import PropTypes from 'prop-types'
import { getPageTableOfContents } from 'notion-utils'
import cn from 'classnames'

export default function TableOfContents ({ blockMap, className, style }) {
  const collectionId = Object.keys(blockMap.collection)[0]
  const page = Object.values(blockMap.block).find(block => block.value.parent_id === collectionId).value
  const nodes = getPageTableOfContents(page, blockMap)

  if (!nodes.length) return null

  /**
   * @param {string} id - The ID of target heading block (could be in UUID format)
   */
  function scrollTo (id) {
    id = id.replaceAll('-', '')
    const target = document.querySelector(`.notion-block-${id}`)
    if (!target) return
    // `65` is the height of expanded nav
    // TODO: Remove the magic number
    const top = document.documentElement.scrollTop + target.getBoundingClientRect().top - 65
    document.documentElement.scrollTo({
      top,
      behavior: 'smooth'
    })
  }

  return (
    <aside
      className={cn(className, 'text-sm text-gray-600 dark:text-gray-400')}
      style={style}
    >
      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
        目录
      </h4>
      <nav className="space-y-1">
        {nodes.map(node => (
          <a
            key={node.id}
            data-target-id={node.id}
            className="block py-1.5 text-xs hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer transition-colors duration-150 border-l border-transparent hover:border-gray-300 dark:hover:border-gray-600"
            style={{ 
              paddingLeft: `${8 + node.indentLevel * 12}px`,
              borderLeftWidth: node.indentLevel === 0 ? '0px' : '1px'
            }}
            onClick={() => scrollTo(node.id)}
          >
            {node.text}
          </a>
        ))}
      </nav>
    </aside>
  )
}

TableOfContents.propTypes = {
  blockMap: PropTypes.object.isRequired
}
