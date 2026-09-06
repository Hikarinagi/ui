import { isCommandGroup, type CommandItem, type CommandItems } from '../types'

export interface CommandMatch {
  item: CommandItem
  start: number
  end: number
}

export interface CommandSection {
  key: string
  label?: string
  matches: CommandMatch[]
}

interface Scored extends CommandMatch {
  score: number
}

interface ScoredSection extends CommandSection {
  best: number
}

function score(item: CommandItem, query: string): Scored | null {
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

function rank(items: CommandItem[], query: string): Scored[] {
  return items
    .map(item => score(item, query))
    .filter((match): match is Scored => match !== null)
    .sort((a, b) => b.score - a.score)
}

export function filterCommands(items: CommandItems, query: string): CommandSection[] {
  const q = query.trim().toLowerCase()
  const sections: ScoredSection[] = []
  let loose: CommandItem[] = []
  const push = (label: string | undefined, entries: CommandItem[]) => {
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
    if (!isCommandGroup(entry)) {
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
