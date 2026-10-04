import { readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { clientReasons, withClientDirective } from './client-directive.ts'

const source = join(import.meta.dirname, '..', '..', 'react', 'src')

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return walk(path)
    return /\.tsx?$/.test(entry.name) && !/\.test\.tsx?$/.test(entry.name) ? [path] : []
  })
}

const only = process.argv.slice(2)
const files = only.length ? only.flatMap(path => walk(join(source, path))) : walk(source)

let changed = 0
for (const file of files) {
  const text = readFileSync(file, 'utf8')
  if (!clientReasons(text, file).length) continue
  const next = withClientDirective(text)
  if (next === text) continue
  writeFileSync(file, next)
  changed++
}
console.log(`Added 'use client' to ${changed} modules`)
