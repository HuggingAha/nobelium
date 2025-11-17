import { clientConfig } from '@/lib/server/config'
import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import Pagination from '@/components/Pagination'
import { getAllPosts } from '@/lib/notion'
import { useConfig } from '@/lib/config'
// [新增] 导入 Grid 组件
import { Grid } from '@/components/ui/Grid'

export async function getStaticProps () {
  const posts = await getAllPosts({ includePages: false })
  const postsToShow = posts.slice(0, clientConfig.postsPerPage)
  const totalPosts = posts.length
  const showNext = totalPosts > clientConfig.postsPerPage
  const totalPages = Math.ceil(totalPosts / clientConfig.postsPerPage)
  return {
    props: {
      page: 1, // current page is 1
      postsToShow,
      showNext,
      totalPages
    },
    revalidate: 1
  }
}

export default function Blog ({ postsToShow, page, showNext, totalPages }) {
  const { title, description } = useConfig()

  return (
    <Container title={title} description={description}>
      {/* [修改] 使用 Grid 组件替换 StaggerAnimation */}
      <Grid
        columns={{ default: 1, md: 2, lg: 3 }} // 响应式布局：小屏幕1列，中等2列，大屏幕2列
        gap={8} // 设置网格间距
        className="my-8"
      >
        {postsToShow.map(post => (
          <BlogPost key={post.id} post={post} />
        ))}
      </Grid>

      <div className="mt-12">
        <Pagination page={page} showNext={showNext} totalPages={totalPages} />
      </div>
    </Container>
  )
}
