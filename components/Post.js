import PropTypes from 'prop-types'
import Image from 'next/image'
import Link from 'next/link'
import cn from 'classnames'
import { useConfig } from '@/lib/config'
import useTheme from '@/lib/theme'
import FormattedDate from '@/components/FormattedDate'
import NotionRenderer from '@/components/NotionRenderer'
import TableOfContents from '@/components/TableOfContents'
import ReadingProgress from '@/components/ReadingProgress'

/**
 * A post renderer
 *
 * @param {PostProps} props
 *
 * @typedef {object} PostProps
 * @prop {object}   post       - Post metadata
 * @prop {object}   blockMap   - Post block data
 * @prop {string}   emailHash  - Author email hash (for Gravatar)
 * @prop {boolean} [fullWidth] - Whether in full-width mode
 */
export default function Post (props) {
  const BLOG = useConfig()
  const { post, blockMap, emailHash, fullWidth = false } = props
  const { dark } = useTheme()

  return (
    <article className={cn('flex flex-col', fullWidth ? 'md:px-24' : 'items-center')}>
      <h1 className={cn(
        'w-full font-bold text-3xl text-black dark:text-white',
        { 'max-w-2xl px-4': !fullWidth }
      )}>
        {post.title}
      </h1>
      {post.type[0] !== 'Page' && (
        <nav className={cn(
          'w-full flex mt-7 items-start text-gray-500 dark:text-gray-400',
          { 'max-w-2xl px-4': !fullWidth }
        )}>
          <div className="flex mb-4">
            <a href={BLOG.socialLink || '#'} className="flex">
              <Image
                alt={BLOG.author}
                width={24}
                height={24}
                src={`https://gravatar.com/avatar/${emailHash}`}
                className="rounded-full"
              />
              <p className="ml-2 md:block">{BLOG.author}</p>
            </a>
            <span className="block">&nbsp;/&nbsp;</span>
          </div>
          <div className="mr-2 mb-4 md:ml-0">
            <FormattedDate date={post.date} />
          </div>
          {post.tags && (
            <div className="flex flex-nowrap max-w-full overflow-x-auto article-tags gap-2">
              {post.tags.map(tag => (
                <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`}>
                  <span className="text-sm px-2.5 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md transition-colors cursor-pointer border border-gray-200 dark:border-gray-700 whitespace-nowrap">
                    {tag}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </nav>
      )}
      <div className="self-stretch -mt-4 flex flex-col items-center lg:flex-row lg:items-stretch">
        {!fullWidth && (
          <div className="hidden lg:block" style={{ width: '180px', paddingRight: '60px' }}>
            <div className="sticky top-24">
              <div className="space-y-6">
                {/* 阅读进度 */}
                <div className="pl-4 border-l border-gray-200 dark:border-gray-700">
                  <ReadingProgress />
                </div>
                
                {/* 元信息 */}
                <div className="pl-4 border-l border-gray-200 dark:border-gray-700 space-y-5">
                  {/* 日期 */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {new Date(post.date).toLocaleDateString('zh-CN', { 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>

                  {/* 标签 */}
                  {post.tags && post.tags.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                        </svg>
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          标签
                        </span>
                      </div>
                      <div className="space-y-2">
                        {post.tags.slice(0, 4).map(tag => (
                          <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`}>
                            <div className="group flex items-center gap-2 cursor-pointer">
                              <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-500 dark:group-hover:bg-gray-400 transition-colors" />
                              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors truncate">
                                {tag}
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        <div className={fullWidth ? 'flex-1 px-4' : 'flex-none w-full max-w-4xl px-4'}>
          <NotionRenderer recordMap={blockMap} fullPage={false} darkMode={dark} />
        </div>
        <div className={cn('order-first lg:order-[unset] w-full lg:w-auto', fullWidth ? 'flex-none' : 'flex-1')} style={{ minWidth: '200px', paddingLeft: '24px' }}>
          <TableOfContents blockMap={blockMap} className="pt-3 sticky" style={{ top: '65px' }} />
        </div>
      </div>
    </article>
  )
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  blockMap: PropTypes.object.isRequired,
  emailHash: PropTypes.string.isRequired,
  fullWidth: PropTypes.bool
}
