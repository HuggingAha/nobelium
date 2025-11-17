// components/Post.js

import PropTypes from 'prop-types'
import Link from 'next/link'
import cn from 'classnames'
import { useConfig } from '@/lib/config'
import useTheme from '@/lib/theme'
import FormattedDate from '@/components/FormattedDate'
import NotionRenderer from '@/components/NotionRenderer'
import TableOfContents from '@/components/TableOfContents'
import ReadingProgress from '@/components/ReadingProgress'
import { Avatar as OptimizedAvatar } from '@/components/ui/OptimizedImage'
import { Text } from '@/components/ui/Typography'
import { Flex } from '@/components/ui/Grid'
import React from 'react'

export default function Post (props) {
  const BLOG = useConfig()
  const { post, blockMap, emailHash, fullWidth = false } = props
  const { dark } = useTheme()

  return (
    <>
      <ReadingProgress />

      <article className={cn('flex flex-col', fullWidth ? 'px-4 md:px-24' : 'items-center')}>
        
        <header className={cn(
          'w-full max-w-3xl mx-auto',
          { 'px-4': !fullWidth }
        )}>
          <h1 className="font-bold text-3xl md:text-4xl text-black dark:text-white my-8 leading-tight">
            {post.title}
          </h1>

          {post.type[0] !== 'Page' && (
            <Flex as="nav" align="center" gap={3} wrap={true} className="text-gray-600 dark:text-gray-400 mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
              <Flex align="center" gap={2}>
                <OptimizedAvatar
                  alt={BLOG.author}
                  size="xs"
                  src={`https://gravatar.com/avatar/${emailHash}`}
                />
                <Text size="sm" weight="medium">{BLOG.author}</Text>
              </Flex>
              <Text size="sm" className="text-gray-400 dark:text-gray-500">·</Text>
              <Text size="sm">
                <FormattedDate date={post.date} />
              </Text>
              {post.tags && post.tags.length > 0 && (
                <>
                  <Text size="sm" className="text-gray-400 dark:text-gray-500 hidden md:block">·</Text>
                  <Flex gap={2} wrap={true} className="max-w-full">
                    {post.tags.map(tag => (
                      <Link key={tag} href={`/tag/${encodeURIComponent(tag)}`} passHref legacyBehavior>
                        <Text as="a" size="sm" className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors whitespace-nowrap">
                          #{tag}
                        </Text>
                      </Link>
                    ))}
                  </Flex>
                </>
              )}
            </Flex>
          )}
        </header>

        {/* [布局修复] 调整网格容器和列分配 */}
        <div className={cn('w-full', { 'max-w-5xl mx-auto': !fullWidth })}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-12">
            
            {/* 主内容区域 */}
            <div className={cn(
              'lg:col-span-4', // 在5列网格中占据4列
              'prose dark:prose-invert max-w-none',
              'prose-a:text-primary-600 dark:prose-a:text-primary-400 hover:prose-a:text-primary-700',
              'prose-img:rounded-lg prose-img:shadow-md'
            )}>
              <NotionRenderer recordMap={blockMap} fullPage={false} darkMode={dark} />
            </div>

            {/* 右侧目录 (仅在非全宽模式下显示) */}
            {!fullWidth && (
              <aside className="hidden lg:block lg:col-span-1"> {/* 占据1列 */}
                <div className="sticky top-24">
                  <TableOfContents blockMap={blockMap} />
                </div>
              </aside>
            )}
          </div>
        </div>
      </article>
    </>
  )
}

Post.propTypes = {
  post: PropTypes.object.isRequired,
  blockMap: PropTypes.object.isRequired,
  emailHash: PropTypes.string.isRequired,
  fullWidth: PropTypes.bool
}
