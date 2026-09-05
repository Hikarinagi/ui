export type FileUploadReason = 'type' | 'size' | 'count'

export interface FileUploadRejection {
  file: File
  reason: FileUploadReason
}

interface Rules {
  accept?: string
  maxSize?: number
  maxFiles?: number
  multiple?: boolean
}

function matchesAccept(file: File, accept: string | undefined) {
  if (!accept) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return accept
    .split(',')
    .map(rule => rule.trim().toLowerCase())
    .filter(Boolean)
    .some(rule => {
      if (rule.startsWith('.')) return name.endsWith(rule)
      if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1))
      return type === rule
    })
}

function sameFile(a: File, b: File) {
  return a.name === b.name && a.size === b.size && a.lastModified === b.lastModified
}

export function selectFiles(current: File[], incoming: File[], rules: Rules) {
  const rejected: FileUploadRejection[] = []
  const next = rules.multiple ? [...current] : []
  for (const file of incoming) {
    if (!matchesAccept(file, rules.accept)) {
      rejected.push({ file, reason: 'type' })
      continue
    }
    if (rules.maxSize !== undefined && file.size > rules.maxSize) {
      rejected.push({ file, reason: 'size' })
      continue
    }
    if (next.some(existing => sameFile(existing, file))) continue
    if (!rules.multiple) {
      next.splice(0, next.length, file)
      continue
    }
    if (rules.maxFiles !== undefined && next.length >= rules.maxFiles) {
      rejected.push({ file, reason: 'count' })
      continue
    }
    next.push(file)
  }
  return { next, rejected }
}
