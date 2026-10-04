import { existsSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { NextConfig } from 'next'

const root = fileURLToPath(new URL('../..', import.meta.url))
const source = (path: string) => fileURLToPath(new URL(path, import.meta.url))

const sharedPublic = source('../shared/public')
const ownPublic = source('./public')

const sharedAssets = readdirSync(sharedPublic)
  .filter(name => !existsSync(join(ownPublic, name)))
  .map(name =>
    statSync(join(sharedPublic, name)).isDirectory()
      ? { source: `/${name}/:path*`, destination: `/docs-public/${name}/:path*` }
      : { source: `/${name}`, destination: `/docs-public/${name}` },
  )

const config: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: root,
  transpilePackages: ['@hina-ui/react'],
  experimental: {
    optimizePackageImports: ['@hina-ui/react'],
  },
  turbopack: {
    root,
    resolveAlias: {
      '@hina-ui/react': '../../packages/react/src/index.ts',
    },
  },
  outputFileTracingIncludes: {
    '/**': [
      '../content/**/*.md',
      '../shared/hina-wordmark.svg',
      './demos/**/*.tsx',
      '../../packages/react/CHANGELOG.md',
      './node_modules/@lobehub/icons-static-svg/icons/openai.svg',
    ],
    '/docs-public/**': ['../shared/public/**/*'],
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [{ source: '/:path*.md', destination: '/md/:path*' }, ...sharedAssets],
      fallback: [],
    }
  },
}

export default config
