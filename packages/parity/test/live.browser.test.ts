import { expect, it } from 'vitest'
import { commands } from 'vitest/browser'
import { normalizeMarkup } from '../src/normalize'
import { liveReact, liveVue, type LiveSuite } from '../src/live'
import { inShard } from '../src/shard'
import type { VueLockKind, VueLockRecord, VueLockState } from '../src/vue-lock'
import { startVueLockClock } from '../src/vue-lock-clock'
import '../src/browser.css'

declare module 'vitest/browser' {
  interface BrowserCommands {
    readVueLock: (kind: VueLockKind, component: string) => Promise<VueLockState>
    writeVueLock: (kind: VueLockKind, component: string, record: VueLockRecord) => Promise<void>
  }
}

const STYLE = / style="([^"]*)"/g

function unordered(lines: string[]) {
  return lines
    .map(line =>
      line.replace(
        STYLE,
        (_, value: string) =>
          ` style="${value
            .split(';')
            .map(declaration => declaration.trim())
            .filter(Boolean)
            .sort()
            .join('; ')}"`,
      ),
    )
    .join('\n')
}

const modules = import.meta.glob<{ default: LiveSuite }>('../cases/*.live.tsx')

for (const [path, load] of inShard(Object.entries(modules))) {
  const file = path.slice('../cases/'.length).replace(/\.live\.tsx$/, '')
  it(file, { timeout: 300_000 }, async () => {
    startVueLockClock()
    const { update, record } = await commands.readVueLock('live', file)
    const suite = (await load()).default
    const locked: VueLockRecord = {}
    for (const entry of suite.cases) {
      expect(locked, `duplicate case name: ${entry.name}`).not.toHaveProperty([entry.name])
      const options = { ignoreAttributes: ['data-v-app', ...(entry.ignoreAttributes ?? [])] }
      const rendered = await liveVue(entry)
      locked[entry.name] = normalizeMarkup(rendered, { exact: true, geometry: false }).split('\n')
      const vue = normalizeMarkup(rendered, options)
      const react = normalizeMarkup(await liveReact(entry), options)
      expect.soft(vue, `${suite.component} / ${entry.name}`).not.toBe('')
      expect.soft(react, `${suite.component} / ${entry.name}`).toBe(vue)
    }
    if (update) return commands.writeVueLock('live', file, locked)
    for (const [name, expected] of Object.entries(record ?? {}))
      expect
        .soft(unordered(locked[name] ?? []), `Vue lock: ${suite.component} / ${name}`)
        .toBe(unordered(expected))
  })
}
