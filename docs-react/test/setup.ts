import { readFileSync } from 'node:fs'
import { registerHooks } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)

registerHooks({
  resolve(specifier, context, next) {
    if (specifier === 'server-only') return { url: 'data:text/javascript,', shortCircuit: true }
    const aliased = specifier.startsWith('~/') ? new URL(specifier.slice(2), root).href : specifier
    try {
      return next(aliased, context)
    } catch (error) {
      if (!/^(\.|file:)/.test(aliased)) throw error
      return next(`${aliased}.ts`, context)
    }
  },
  load(url, context, next) {
    if (!url.endsWith('.json')) return next(url, context)
    return {
      format: 'module',
      source: `export default ${readFileSync(fileURLToPath(url), 'utf8')}`,
      shortCircuit: true,
    }
  },
})
