import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useConfig } from '@/lib/config'
import Head from 'next/head'
import PropTypes from 'prop-types'
import cn from 'classnames'
import { SEO, ArticleSEO, AccessibilityEnhancements } from '@/components/ui/SEO'
import { AnimationWrapper } from '@/components/AnimationWrapper'
// import BlogPost from './BlogPost'

const Container = ({ children, layout, fullWidth, ...customMeta }) => {
  const BLOG = useConfig()

  const url = BLOG.path.length ? `${BLOG.link}/${BLOG.path}` : BLOG.link
  const meta = {
    title: BLOG.title,
    description: BLOG.description,
    type: 'website',
    ...customMeta
  }

  // 生成规范URL
  const canonicalUrl = meta.slug ? `${url}/${meta.slug}` : url

  return (
    <>
      {/* 现代化的SEO优化 */}
      {meta.type === 'article' ? (
        <ArticleSEO
          title={meta.title}
          description={meta.description}
          image={meta.image || `${BLOG.ogImageGenerateURL}/${encodeURIComponent(meta.title)}.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2Fnobelium.vercel.app%2Flogo-for-dark-bg.svg`}
          author={BLOG.author}
          datePublished={meta.date}
          dateModified={meta.lastModified || meta.date}
          tags={meta.tags || []}
          readingTime={meta.readingTime}
          wordCount={meta.wordCount}
          canonical={canonicalUrl}
        />
      ) : (
        <SEO
          title={meta.title}
          description={meta.description}
          keywords={meta.keywords || BLOG.seo.keywords}
          image={meta.image || `${BLOG.ogImageGenerateURL}/${encodeURIComponent(meta.title)}.png?theme=dark&md=1&fontSize=125px&images=https%3A%2F%2Fnobelium.vercel.app%2Flogo-for-dark-bg.svg`}
          canonical={canonicalUrl}
          type={meta.type}
        />
      )}

      {/* 可访问性增强 */}
      <AccessibilityEnhancements />
      <div
        className={`wrapper ${BLOG.font === 'serif' ? 'font-serif' : 'font-sans'
          }`}
      >
        <Header
          navBarTitle={layout === 'blog' ? meta.title : null}
          fullWidth={fullWidth}
        />
        <main
          id="main-content"
          className={cn(
            'flex-grow transition-all',
            layout !== 'blog' && ['self-center', fullWidth ? 'px-4 md:px-24' : 'w-full max-w-4xl']
          )}
        >
          <AnimationWrapper variant="fadeIn" delay={100}>
            {children}
          </AnimationWrapper>
        </main>
        <Footer fullWidth={fullWidth} />
      </div>
    </>
  )
}

Container.propTypes = {
  children: PropTypes.node
}

export default Container
