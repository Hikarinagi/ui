import { readdir, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import type { Plugin } from 'vite'

const CONTENT_ROOT = fileURLToPath(new URL('./content/', import.meta.url))
const ID = 'virtual:docs-search'
const RESOLVED = `\0${ID}`
const COMMON_LIMIT = 3
const HEADING = /^(##|###)\s+(.+?)\s*(?:\{#([^}]+)\})?\s*$/gm
const FENCE = /```[\s\S]*?```/g

export interface SearchHeading {
  id: string
  label: string
  parent?: string
}

export interface SearchPage {
  to: string
  title: string
  description?: string
  headings: SearchHeading[]
}

export type SearchIndex = Record<string, SearchPage[]>

interface Parsed {
  title: string
  description?: string
  headings: SearchHeading[]
}

function field(meta: string, name: string): string | undefined {
  const value = meta.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim()
  return value?.replace(/^(['"])(.*)\1$/, '$2')
}

function parse(raw: string): Parsed {
  const front = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const meta = front?.[1] ?? ''
  const body = (front ? raw.slice(front[0].length) : raw).replace(FENCE, '')
  const headings: SearchHeading[] = []
  let parent: string | undefined
  for (const match of body.matchAll(HEADING)) {
    const level = match[1]!.length
    const label = match[2]!.replace(/`/g, '')
    const id = match[3] ?? `section-${headings.length + 1}`
    if (level === 2) parent = label
    headings.push({ id, label, parent: level === 3 ? parent : undefined })
  }
  return { title: field(meta, 'title') ?? '', description: field(meta, 'description'), headings }
}

function route(name: string): string {
  const path = `/${name.split('\\').join('/').replace(/\.md$/, '')}`
  return path.replace(/\/index$/, '') || '/'
}

async function pagesOf(locale: string): Promise<SearchPage[]> {
  const dir = `${CONTENT_ROOT}${locale}/`
  const names = (await readdir(dir, { recursive: true, encoding: 'utf8' })).filter(name =>
    name.endsWith('.md'),
  )
  const parsed = await Promise.all(
    names.map(async name => ({ to: route(name), ...parse(await readFile(dir + name, 'utf8')) })),
  )
  const frequency = new Map<string, number>()
  for (const page of parsed) {
    for (const label of new Set(page.headings.map(heading => heading.label))) {
      frequency.set(label, (frequency.get(label) ?? 0) + 1)
    }
  }
  return parsed
    .map(page => ({
      ...page,
      headings: page.headings.filter(heading => (frequency.get(heading.label) ?? 0) < COMMON_LIMIT),
    }))
    .sort((a, b) => a.to.localeCompare(b.to))
}

export function searchIndex(): Plugin {
  return {
    name: 'hn-docs-search-index',
    resolveId(id) {
      return id === ID ? RESOLVED : undefined
    },
    async load(id) {
      if (id !== RESOLVED) return
      const locales = (await readdir(CONTENT_ROOT, { withFileTypes: true }))
        .filter(entry => entry.isDirectory())
        .map(entry => entry.name)
      const index: SearchIndex = {}
      for (const locale of locales) index[locale] = await pagesOf(locale)
      return `export default ${JSON.stringify(index)}`
    },
  }
}
