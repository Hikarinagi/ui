import { readdir } from 'node:fs/promises'
import type { Plugin } from 'vite'
import { CONTENT_ROOT, pagesOf, type SearchIndex } from '../shared/search-index'

const ID = 'virtual:docs-search'
const RESOLVED = `\0${ID}`

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
