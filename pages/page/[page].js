import { config } from '@/lib/server/config'
import Container from '@/components/Container'
import BlogPost from '@/components/BlogPost'
import Pagination from '@/components/Pagination'
import { getAllPosts } from '@/lib/notion'
// [新增] 导入 Grid 组件
import { Grid } from '@/components/ui/Grid'

const Page = ({ postsToShow, page, showNext, totalPages }) => {
  return (
    <Container>
      {postsToShow && (
        // [修改] 将 div.map 结构替换为 Grid 组件
        <Grid
          columns={{ default: 1, md: 2, lg: 3 }}
          gap={8}
          className="my-8"
        >
          {postsToShow.map(post => <BlogPost key={post.id} post={post} />)}
        </Grid>
      )}
      <Pagination page={page} showNext={showNext} totalPages={totalPages} />
    </Container>
  )
}

export async function getStaticProps (context) {
  const { page } = context.params // Get Current Page No.
  const posts = await getAllPosts({ includePages: false })
  const postsToShow = posts.slice(
    config.postsPerPage * (page - 1),
    config.postsPerPage * page
  )
  const totalPosts = posts.length
  const showNext = page * config.postsPerPage < totalPosts
  const totalPages = Math.ceil(totalPosts / config.postsPerPage)
  return {
    props: {
      page, // Current Page
      postsToShow,
      showNext,
      totalPages
    },
    revalidate: 1
  }
}

export async function getStaticPaths () {
  const posts = await getAllPosts({ includePages: false })
  const totalPosts = posts.length
  const totalPages = Math.ceil(totalPosts / config.postsPerPage)
  return {
    // remove first page, we 're not gonna handle that.
    paths: Array.from({ length: totalPages - 1 }, (_, i) => ({
      params: { page: '' + (i + 2) }
    })),
    fallback: true
  }
}

export default Page
