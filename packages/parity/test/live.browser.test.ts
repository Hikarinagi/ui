import { expect, it } from 'vitest'
import { normalizeMarkup } from '../src/normalize'
import { liveReact, liveVue, type LiveSuite } from '../src/live'
import '../src/browser.css'

const modules = import.meta.glob<{ default: LiveSuite }>('../cases/*.live.tsx')

for (const [path, load] of Object.entries(modules)) {
  const file = path.slice('../cases/'.length).replace(/\.live\.tsx$/, '')
  it(file, { timeout: 180_000 }, async () => {
    const suite = (await load()).default
    for (const entry of suite.cases) {
      const options = { ignoreAttributes: ['data-v-app', ...(entry.ignoreAttributes ?? [])] }
      const vue = normalizeMarkup(await liveVue(entry), options)
      const react = normalizeMarkup(await liveReact(entry), options)
      expect.soft(vue, `${suite.component} / ${entry.name}`).not.toBe('')
      expect.soft(react, `${suite.component} / ${entry.name}`).toBe(vue)
    }
  })
}
