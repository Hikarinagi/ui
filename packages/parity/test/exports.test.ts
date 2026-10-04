import { readFileSync, writeFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { EXCEPTIONS, REACT_ONLY, RENAMED } from '../src/coverage'

const pendingFile = new URL('../coverage/pending.json', import.meta.url)
const pending: string[] = JSON.parse(readFileSync(pendingFile, 'utf8'))

describe('export coverage', () => {
  const react = new Set(Object.keys(R))
  const counterpart = (name: string) => RENAMED[name] ?? name
  const missing = Object.keys(V)
    .filter(name => !(name in EXCEPTIONS) && !react.has(counterpart(name)))
    .sort()

  if (process.env.HINA_UPDATE_PENDING)
    writeFileSync(pendingFile, `${JSON.stringify(missing, null, 2)}\n`)

  it('every Vue export has a React counterpart, a recorded exception, or a pending entry', () => {
    expect(missing.filter(name => !pending.includes(name))).toEqual([])
  })

  it('the pending list only shrinks: ported exports are removed from it', () => {
    expect(pending.filter(name => !missing.includes(name))).toEqual([])
  })

  it('React exports nothing the Vue package lacks', () => {
    const vue = new Set(Object.keys(V).map(counterpart))
    expect([...react].filter(name => !vue.has(name) && !(name in REACT_ONLY)).sort()).toEqual([])
  })
})
