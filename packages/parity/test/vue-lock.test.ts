import { describe, expect, it } from 'vitest'
import type { ParityCase, ParitySuite } from '../src/cases'
import { normalizeMarkup } from '../src/normalize'
import { renderVue } from '../src/render'
import { readVueLock, writeVueLock, type VueLockRecord } from '../src/vue-lock'

const modules = import.meta.glob<{ default: ParitySuite }>('../cases/*.cases.tsx')
const kind = process.env.NODE_ENV === 'production' ? 'markup-production' : 'markup'

async function markup(entry: ParityCase) {
  return normalizeMarkup(await renderVue(entry.vue), { exact: true }).split('\n')
}

const components = await Promise.all(
  Object.entries(modules).map(async ([path, load]) => {
    const file = path.slice('../cases/'.length).replace(/\.cases\.tsx$/, '')
    const { update, record } = readVueLock(kind, file)
    const cases = update || record ? (await load()).default.cases : []
    return { file, update, record, cases }
  }),
)

describe(`Vue ${kind} lock`, () => {
  for (const { file, update, record, cases } of components) {
    if (update) {
      it(`${file} (recording)`, async () => {
        const next: VueLockRecord = {}
        for (const entry of cases) {
          expect(next, `duplicate case name: ${entry.name}`).not.toHaveProperty([entry.name])
          next[entry.name] = await markup(entry)
        }
        writeVueLock(kind, file, next)
      })
      continue
    }

    if (!record) {
      it.skip(`${file} (no Vue ${kind} lock recorded)`)
      continue
    }

    describe(file, () => {
      for (const name of Object.keys(record))
        if (!cases.some(entry => entry.name === name))
          it(name, () => {
            expect.fail(`the recorded case is missing from cases/${file}.cases.tsx`)
          })
      for (const entry of cases) {
        const expected = record[entry.name]
        if (!expected) {
          it.skip(`${entry.name} (not recorded)`)
          continue
        }
        it(entry.name, async () => {
          expect((await markup(entry)).join('\n')).toBe(expected.join('\n'))
        })
      }
    })
  }
})
