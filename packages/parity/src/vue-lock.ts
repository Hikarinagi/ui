import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

export type VueLockKind = 'markup' | 'markup-production' | 'live'
export type VueLockRecord = Record<string, string[]>

export interface VueLockState {
  update: boolean
  record?: VueLockRecord
}

const directory = fileURLToPath(new URL('../snapshots/', import.meta.url))

export function vueLockFile(kind: VueLockKind, component: string) {
  return join(directory, kind, `${component}.json`)
}

export function vueLockUpdating(component: string, request = process.env.HINA_UPDATE_VUE_LOCK) {
  if (!request) return false
  if (request === '1' || request === 'true') return true
  return request
    .split(',')
    .map(name => name.trim())
    .includes(component)
}

export function readVueLock(kind: VueLockKind, component: string): VueLockState {
  const file = vueLockFile(kind, component)
  return {
    update: vueLockUpdating(component),
    record: existsSync(file)
      ? (JSON.parse(readFileSync(file, 'utf8')) as VueLockRecord)
      : undefined,
  }
}

export function writeVueLock(kind: VueLockKind, component: string, record: VueLockRecord) {
  const file = vueLockFile(kind, component)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, `${JSON.stringify(record, null, 2)}\n`)
}
