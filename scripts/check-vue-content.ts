import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { frameworkView } from '../docs/shared/framework.ts'

const root = fileURLToPath(new URL('..', import.meta.url))
const content = join(root, 'docs', 'content')
const ref = process.argv[2] ?? 'HEAD'

function walk(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry =>
    entry.isDirectory()
      ? walk(join(directory, entry.name))
      : entry.name.endsWith('.md')
        ? [join(directory, entry.name)]
        : [],
  )
}

function committed(path: string) {
  try {
    return execFileSync('git', ['show', `${ref}:${path}`], {
      cwd: root,
      encoding: 'utf8',
      maxBuffer: 1 << 26,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
  } catch {
    return undefined
  }
}

const tracked = new Set(
  execFileSync('git', ['ls-tree', '-r', '--name-only', ref, '--', 'docs/content'], {
    cwd: root,
    encoding: 'utf8',
  })
    .split('\n')
    .filter(path => path.endsWith('.md')),
)

const changed: string[] = []
let blocks = 0
for (const file of walk(content)) {
  const path = relative(root, file).split('\\').join('/')
  tracked.delete(path)
  const current = readFileSync(file, 'utf8')
  const before = committed(path)
  if (before === undefined) {
    changed.push(`${path}: not in ${ref}`)
    continue
  }
  if (current.includes(':::')) blocks += 1
  if (frameworkView(current, 'vue') !== frameworkView(before, 'vue')) changed.push(path)
}
for (const path of tracked) changed.push(`${path}: removed since ${ref}`)

if (changed.length) {
  console.error(`Vue view of docs/content differs from ${ref}:\n${changed.join('\n')}`)
  process.exit(1)
}
console.log(
  `Vue view of ${walk(content).length} content files matches ${ref} byte for byte (${blocks} files use framework blocks).`,
)
