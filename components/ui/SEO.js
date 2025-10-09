/*******************************
 * 现代化 SEO 组件
 *******************************/

import Head from 'next/head'
import { useRouter } from 'next/router'

// 基础 SEO 配置
const defaultSEO = {
  title: 'HUGGINGAHA - 思行无辍',
  description: '分享技术见解、生活感悟和创意思考的个人博客',
  keywords: ['博客', '技术', '思考', '创意', '生活'],
  author: 'Baiye',
  siteName: 'HUGGINGAHA',
  siteUrl: 'https://huggingaha-blog.vercel.app',
  twitterHandle: '@huggingAha',
  locale: 'zh_CN',
  type: 'website'
}

// 结构化数据生成器
const generateStructuredData = ({
  type = 'website',
  title,
  description,
  image,
  url,
  author,
  datePublished,
  dateModified,
  keywords
}) => {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type === 'article' ? 'BlogPosting' : 'WebPage',
    headline: title,
    description: description,
    url: url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    }
  }

  if (type === 'article') {
    return {
      ...baseData,
      datePublished: datePublished,
      dateModified: dateModified || datePublished,
      author: {
        '@type': 'Person',
        name: author?.name || 'Baiye',
        url: author?.url || 'https://x.com/huggingAha'
      },
      publisher: {
        '@type': 'Organization',
        name: defaultSEO.siteName,
        logo: {
          '@type': 'ImageObject',
          url: `${defaultSEO.siteUrl}/favicon.ico`
        }
      },
      image: image,
      keywords: keywords?.join(', ')
    }
  }

  return {
    ...baseData,
    image: image,
    publisher: {
      '@type': 'Organization',
      name: defaultSEO.siteName,
      url: defaultSEO.siteUrl
    }
  }
}

// 网站图标生成
const generateFaviconLinks = () => {
  return (
    <>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={defaultSEO.siteName} />
    </>
  )
}

// 主要的 SEO 组件
const SEO = ({
  title = defaultSEO.title,
  description = defaultSEO.description,
  keywords = defaultSEO.keywords,
  image = `${defaultSEO.siteUrl}/og-image.png`,
  url = defaultSEO.siteUrl,
  type = 'website',
  author = { name: defaultSEO.author, url: 'https://x.com/huggingAha' },
  datePublished,
  dateModified,
  noindex = false,
  canonical,
  children,
  ...props
}) => {
  const router = useRouter()
  const currentUrl = `${defaultSEO.siteUrl}${router.asPath}`
  const canonicalUrl = canonical || currentUrl

  // 生成页面标题
  const pageTitle = title === defaultSEO.title ? title : `${title} | ${defaultSEO.siteName}`

  // 生成结构化数据
  const structuredData = generateStructuredData({
    type,
    title,
    description,
    image,
    url: canonicalUrl,
    author,
    datePublished,
    dateModified,
    keywords
  })

  return (
    <Head>
      {/* 基本元标签 */}
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />
      <meta name="author" content={author.name} />
      <meta name="robots" content={noindex ? 'noindex,nofollow' : 'index,follow'} />
      <meta name="googlebot" content={noindex ? 'noindex,nofollow' : 'index,follow'} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={defaultSEO.siteName} />
      <meta property="og:locale" content={defaultSEO.locale} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content={defaultSEO.twitterHandle} />
      <meta name="twitter:creator" content={defaultSEO.twitterHandle} />

      {/* 规范链接 */}
      <link rel="canonical" href={canonicalUrl} />

      {/* 网站图标 */}
      {generateFaviconLinks()}

      {/* 结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 额外的 SEO 标签 */}
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="global" />
      <meta name="rating" content="general" />

      {/* 移动设备优化 */}
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta name="format-detection" content="telephone=no" />

      {/* 防止重复内容 */}
      <link rel="alternate" hrefLang="zh-CN" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {children}
    </Head>
  )
}

// 文章页面专用 SEO 组件
const ArticleSEO = ({
  title,
  description,
  image,
  author = defaultSEO.author,
  datePublished,
  dateModified,
  tags = [],
  readingTime,
  wordCount,
  ...props
}) => {
  const articleKeywords = [...defaultSEO.keywords, ...tags]

  return (
    <SEO
      title={title}
      description={description}
      keywords={articleKeywords}
      image={image}
      type="article"
      author={{ name: author, url: 'https://x.com/huggingAha' }}
      datePublished={datePublished}
      dateModified={dateModified}
      {...props}
    >
      {/* 文章专用元标签 */}
      <meta name="article:author" content={author} />
      <meta name="article:published_time" content={datePublished} />
      <meta name="article:modified_time" content={dateModified} />
      <meta name="article:tag" content={tags.join(', ')} />
      <meta name="article:section" content="Technology" />

      {readingTime && <meta name="article:reading_time" content={`${readingTime} min`} />}
      {wordCount && <meta name="article:word_count" content={wordCount} />}

      {/* JSON-LD 文章结构化数据 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: title,
            description: description,
            image: image,
            author: {
              '@type': 'Person',
              name: author,
              url: 'https://x.com/huggingAha'
            },
            publisher: {
              '@type': 'Organization',
              name: defaultSEO.siteName,
              logo: {
                '@type': 'ImageObject',
                url: `${defaultSEO.siteUrl}/favicon.ico`
              }
            },
            datePublished: datePublished,
            dateModified: dateModified,
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `${defaultSEO.siteUrl}${typeof window !== 'undefined' ? window.location.pathname : ''}`
            },
            wordCount: wordCount,
            articleSection: 'Technology',
            keywords: tags.join(', ')
          })
        }}
      />
    </SEO>
  )
}

// 网站地图生成器
const generateSitemap = (posts) => {
  const baseUrl = defaultSEO.siteUrl
  const urls = [
    baseUrl,
    `${baseUrl}/about`,
    `${baseUrl}/search`,
    ...posts.map(post => `${baseUrl}/${post.slug}`)
  ]

  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls.map(url => `
        <url>
          <loc>${url}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
    </urlset>`
}

// robots.txt 生成器
const generateRobotsTxt = () => {
  return `User-agent: *
Allow: /

# 禁止访问管理页面
Disallow: /admin/
Disallow: /api/

# 网站地图
Sitemap: ${defaultSEO.siteUrl}/sitemap.xml

# 爬取延迟
Crawl-delay: 1

# 清理参数
Clean-param: ref&utm_source&utm_medium&utm_campaign&utm_term&utm_content&fbclid&gclid&yclid&pk_campaign&pk_kwd&pk_keyword&piwik_campaign&piwik_kwd&piwik_keyword&mtm_source&mtm_medium&mtm_campaign&mtm_keyword&mtm_content&mtm_cid&mtm_group&mtm_placement&_ga&_gac&_gid&fb_action_ids&fb_action_types&fb_source&fb_ref&action_object_map&action_type_map&action_ref_map

# 主机
Host: ${defaultSEO.siteUrl}`
}

// 可访问性增强
const AccessibilityEnhancements = () => {
  return (
    <>
      {/* 跳过导航链接 */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
      >
        跳到主内容
      </a>

      {/* 屏幕阅读器专用内容 */}
      <div className="sr-only" role="status" aria-live="polite">
        页面加载完成
      </div>

      {/* 键盘导航提示 */}
      <div
        className="sr-only"
        aria-label="键盘导航提示"
      >
        使用 Tab 键在页面元素间导航，使用 Enter 键激活链接和按钮
      </div>
    </>
  )
}

export {
  SEO,
  ArticleSEO,
  defaultSEO,
  generateSitemap,
  generateRobotsTxt,
  AccessibilityEnhancements,
  generateStructuredData
}

export default SEO