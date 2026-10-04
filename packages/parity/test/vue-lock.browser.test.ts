import { describe, expect, it } from 'vitest'
import { commands } from 'vitest/browser'
import { normalizeMarkup } from '../src/normalize'
import { liveVue, type LiveSuite } from '../src/live'
import { inShard } from '../src/shard'
import type { VueLockKind, VueLockRecord, VueLockState } from '../src/vue-lock'
import '../src/browser.css'

declare module 'vitest/browser' {
  interface BrowserCommands {
    readVueLock: (kind: VueLockKind, component: string) => Promise<VueLockState>
    writeVueLock: (kind: VueLockKind, component: string, record: VueLockRecord) => Promise<void>
  }
}

const modules = import.meta.glob<{ default: LiveSuite }>('../cases/*.live.tsx')

describe('Vue live lock', () => {
  for (const [path, load] of inShard(Object.entries(modules))) {
    const file = path.slice('../cases/'.length).replace(/\.live\.tsx$/, '')
    it(file, { timeout: 180_000 }, async ({ skip }) => {
      const { update, record } = await commands.readVueLock('live', file)
      if (!update && !record) return skip('no Vue live lock recorded')
      const suite = (await load()).default
      const actual: VueLockRecord = {}
      for (const entry of suite.cases) {
        expect(actual, `duplicate case name: ${entry.name}`).not.toHaveProperty([entry.name])
        actual[entry.name] = normalizeMarkup(await liveVue(entry), { exact: true }).split('\n')
      }
      if (update) return commands.writeVueLock('live', file, actual)
      for (const [name, expected] of Object.entries(record!))
        expect
          .soft(actual[name]?.join('\n'), `${suite.component} / ${name}`)
          .toBe(expected.join('\n'))
    })
  }
})
