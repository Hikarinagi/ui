export interface CommandMatchable {
  label: string
  description?: string
  keywords?: string[]
}

export interface CommandGroupOf<T> {
  label: string
  items: T[]
}

export interface CommandMatch<T extends CommandMatchable = CommandMatchable> {
  item: T
  start: number
  end: number
}

export interface CommandSection<T extends CommandMatchable = CommandMatchable> {
  key: string
  label?: string
  matches: CommandMatch<T>[]
}

interface Scored<T extends CommandMatchable> extends CommandMatch<T> {
  score: number
}

interface ScoredSection<T extends CommandMatchable> extends CommandSection<T> {
  best: number
}

function isGroup<T>(entry: T | CommandGroupOf<T>): entry is CommandGroupOf<T> {
  return 'items' in (entry as object)
}

function score<T extends CommandMatchable>(item: T, query: string): Scored<T> | null {
  if (!query) return { item, start: -1, end: -1, score: 0 }
  const label = item.label.toLowerCase()
  const at = label.indexOf(query)
  if (at === 0) return { item, start: 0, end: query.length, score: label === query ? 4 : 3 }
  if (at > 0) return { item, start: at, end: at + query.length, score: 2 }
  const keywords = item.keywords?.map(keyword => keyword.toLowerCase()) ?? []
  if (keywords.includes(query)) return { item, start: -1, end: -1, score: 1.5 }
  if (keywords.some(keyword => keyword.includes(query)))
    return { item, start: -1, end: -1, score: 1 }
  if (item.description?.toLowerCase().includes(query)) {
    return { item, start: -1, end: -1, score: 0.5 }
  }
  return null
}

function rank<T extends CommandMatchable>(items: T[], query: string): Scored<T>[] {
  return items
    .map(item => score(item, query))
    .filter((match): match is Scored<T> => match !== null)
    .sort((a, b) => b.score - a.score)
}

export function filterCommands<T extends CommandMatchable>(
  items: ReadonlyArray<T | CommandGroupOf<T>>,
  query: string,
): CommandSection<T>[] {
  const q = query.trim().toLowerCase()
  const sections: ScoredSection<T>[] = []
  let loose: T[] = []
  const push = (label: string | undefined, entries: T[]) => {
    const ranked = rank(entries, q)
    if (ranked.length === 0) return
    sections.push({
      key: String(sections.length),
      label,
      best: ranked[0]!.score,
      matches: ranked.map(({ item, start, end }) => ({ item, start, end })),
    })
  }
  const flush = () => {
    if (loose.length === 0) return
    push(undefined, loose)
    loose = []
  }
  for (const entry of items) {
    if (!isGroup(entry)) {
      loose.push(entry)
      continue
    }
    flush()
    push(entry.label, entry.items)
  }
  flush()
  if (q) sections.sort((a, b) => b.best - a.best)
  return sections.map(({ key, label, matches }) => ({ key, label, matches }))
}
