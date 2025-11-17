import Link from 'next/link'
import { useConfig } from '@/lib/config'
import FormattedDate from '@/components/FormattedDate'
// [新增] 导入现代化的UI组件
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card'
import { Heading, Text } from '@/components/ui/Typography'
import { Flex } from '@/components/ui/Grid'
import React from 'react' // 确保React已导入

const BlogPost = ({ post }) => {
  const BLOG = useConfig()

  return (
    // [修改] 使用 Link 包裹 Card，并使其表现为链接
    <Link href={`${BLOG.path || ''}/${post.slug}`} passHref legacyBehavior>
      <Card
        as="a" // 使卡片在语义上表现为链接
        variant="elevated" // 使用带悬浮效果的卡片
        hover={true} // 开启鼠标悬浮时的放大和阴影效果
        className="flex flex-col h-full transition-all duration-300 ease-in-out" // 保证卡片等高和动画效果
      >
        <CardHeader>
          {/* [修改] 使用 Heading 组件并限制行数 */}
          <Heading level={3} className="line-clamp-2 text-lg md:text-xl font-medium cursor-pointer text-black dark:text-gray-100">
            {post.title}
          </Heading>
        </CardHeader>
        <CardContent className="flex-grow">
          {/* [修改] 使用 Text 组件并限制行数 */}
          <Text variant="muted" className="line-clamp-3 leading-relaxed">
            {post.summary}
          </Text>
        </CardContent>
        <CardFooter>
          {/* [修改] 使用 Flex 布局排列元信息 */}
          <Flex justify="between" className="w-full text-xs">
            <Text variant="subtle">
              <FormattedDate date={post.date} />
            </Text>
            {post.tags && post.tags.length > 0 && (
              <Flex gap={2} className="overflow-hidden">
                {post.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-300">
                    {tag}
                  </span>
                ))}
              </Flex>
            )}
          </Flex>
        </CardFooter>
      </Card>
    </Link>
  )
}

export default BlogPost
