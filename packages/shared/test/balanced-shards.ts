import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { relative } from 'node:path'

interface Spec {
  moduleId: string
}

interface Context {
  config: { root: string; shard?: { index: number; count: number } }
}

interface Finished {
  relativeModuleId: string
  ok(): boolean
  diagnostic(): { duration: number }
}

interface Sorter {
  sort(files: never[]): unknown
}

export function balance<T>(
  entries: T[],
  count: number,
  weigh: (entry: T) => number,
  name: (entry: T) => string,
) {
  const bins = Array.from({ length: count }, () => ({ weight: 0, entries: [] as T[] }))
  const ordered = entries
    .map(entry => ({ entry, weight: weigh(entry), name: name(entry) }))
    .sort((a, b) => b.weight - a.weight || (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
  for (const { entry, weight } of ordered) {
    const lightest = bins.reduce((best, bin) => (bin.weight < best.weight ? bin : best))
    lightest.weight += weight
    lightest.entries.push(entry)
  }
  return bins.map(bin => bin.entries)
}

export function median(values: number[]) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.floor(sorted.length / 2)] ?? 1
}

function read(file: string): Record<string, number> {
  return existsSync(file) ? (JSON.parse(readFileSync(file, 'utf8')) as Record<string, number>) : {}
}

export function balancedSequencer(Base: new (ctx: never) => Sorter, file: string) {
  const durations = read(file)
  const fallback = median(Object.values(durations))
  return class {
    readonly ctx: Context
    readonly base: Sorter

    constructor(ctx: Context) {
      this.ctx = ctx
      this.base = new Base(ctx as never)
    }

    async sort<S extends Spec>(files: S[]) {
      return (await this.base.sort(files as never[])) as S[]
    }

    async shard<S extends Spec>(files: S[]) {
      const { root, shard } = this.ctx.config
      const key = (spec: S) => relative(root, spec.moduleId)
      return balance(files, shard!.count, spec => durations[key(spec)] ?? fallback, key)[
        shard!.index - 1
      ]!
    }
  }
}

export function durationReporter(file: string) {
  return {
    onTestRunEnd(modules: readonly Finished[]) {
      const durations = read(file)
      for (const module of modules) {
        const duration = module.diagnostic().duration
        if (module.ok() && duration > 0)
          durations[module.relativeModuleId] = Math.round(duration / 100) / 10
      }
      const sorted = Object.fromEntries(
        Object.entries(durations).sort(([a], [b]) => (a < b ? -1 : 1)),
      )
      writeFileSync(file, `${JSON.stringify(sorted, null, 2)}\n`)
    },
  }
}
