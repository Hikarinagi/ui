import 'server-only'
import { readFile, readdir } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { cache } from 'react'
import { parse } from 'yaml'

import { reactSource, sourceApi, type PageApi } from './api'
import type { Locale } from './routes'

export { hrefFor, localeFromSlug } from './routes'
export type { Locale } from './routes'

export interface Frontmatter {
  title: string
  description?: string
  links?: { label: string; href: string }[]
  tocDepth?: number
}

export interface Doc {
  locale: Locale
  path: string
  frontmatter: Frontmatter
  body: string
  api: PageApi
}

export const contentRoot = join(process.cwd(), '..', 'docs', 'content')

function split(source: string) {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(source)
  if (!match) return { frontmatter: { title: '' } as Frontmatter, body: source }
  return {
    frontmatter: parse(match[1]!) as Frontmatter,
    body: source.slice(match[0].length),
  }
}

export const loadDoc = cache(async (locale: Locale, path: string): Promise<Doc | null> => {
  const file = join(contentRoot, locale, `${path || 'index'}.md`)
  try {
    const source = await readFile(file, 'utf8')
    const api = sourceApi(source, path)
    const { frontmatter, body } = split(reactSource(source, locale, path, api))
    return { locale, path, frontmatter, body, api }
  } catch {
    return null
  }
})

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map(entry =>
      entry.isDirectory()
        ? walk(join(directory, entry.name))
        : Promise.resolve([join(directory, entry.name)]),
    ),
  )
  return nested.flat()
}

export const listDocs = cache(async () => {
  const locales: Locale[] = ['zh-CN', 'en']
  const all = await Promise.all(
    locales.map(async locale => {
      const root = join(contentRoot, locale)
      const files = (await walk(root)).filter(file => file.endsWith('.md'))
      return files.map(file => ({ locale, path: relative(root, file).replace(/\.md$/, '') }))
    }),
  )
  return all.flat()
})
