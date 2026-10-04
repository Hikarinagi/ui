import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

export const sharedPublic = join(process.cwd(), '..', 'shared', 'public')
export const ownPublic = join(process.cwd(), 'public')

export const contentTypes: Record<string, string> = {
  gif: 'image/gif',
  jpg: 'image/jpeg',
  json: 'application/json; charset=utf-8',
  png: 'image/png',
  svg: 'image/svg+xml',
  txt: 'text/plain; charset=utf-8',
  webp: 'image/webp',
}

function walk(directory: string): string[] {
  return readdirSync(directory).flatMap(name => {
    const path = join(directory, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

export function sharedAssets() {
  const own = new Set(walk(ownPublic).map(file => relative(ownPublic, file)))
  return walk(sharedPublic)
    .map(file => relative(sharedPublic, file))
    .filter(file => !own.has(file) && (file.split('.').pop() ?? '') in contentTypes)
}
