import { describe, expect, it } from 'vitest'
import type { ParitySuite } from '../src/cases'
import { normalizeMarkup } from '../src/normalize'
import { renderReact, renderVue } from '../src/render'

const modules = import.meta.glob<{ default: ParitySuite }>('../cases/*.cases.tsx')

for (const [path, load] of Object.entries(modules)) {
  const file = path.slice('../cases/'.length)
  const loaded = await load().then(
    module => ({ suite: module.default, error: undefined }),
    (error: unknown) => ({ suite: undefined, error }),
  )
  describe(loaded.suite?.component ?? file, () => {
    if (!loaded.suite) {
      it(`loads ${file}`, () => {
        throw loaded.error
      })
      return
    }
    for (const entry of loaded.suite.cases) {
      it(entry.name, async () => {
        const options = { ignoreAttributes: entry.ignoreAttributes }
        const vue = normalizeMarkup(await renderVue(entry.vue), options)
        const react = normalizeMarkup(renderReact(entry.react), options)
        expect(vue).not.toBe('')
        expect(react).toBe(vue)
      })
    }
  })
}
