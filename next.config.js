/** @type {import('next').NextConfig} */
const nextConfig = {
  // 性能优化配置
  swcMinify: true,
  compress: true,
  poweredByHeader: false,

  // 图片优化配置
  images: {
    domains: ['gravatar.com', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 实验性功能
  experimental: {
    // 优化CSS
    // optimizeCss: true,
    // 启用Web Vitals
    webVitalsAttribution: ['CLS', 'LCP'],
  },

  // ESLint配置
  eslint: {
    dirs: ['components', 'layouts', 'lib', 'pages'],
  },

  // 安全头配置
  async headers() {
    return [
      {
        source: '/:path*{/}?',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'interest-cohort=()'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          }
        ]
      }
    ]
  },

  // Webpack配置优化
  webpack: (config, { dev, isServer }) => {
    // 代码分割优化
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            enforce: true,
          },
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };
    }

    return config;
  },

  // 转译包配置
  transpilePackages: ['dayjs'],

  // 环境变量配置
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // 页面扩展配置
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
}

module.exports = nextConfig
