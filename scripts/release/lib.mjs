import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'

export const levels = ['patch', 'minor', 'major']

export const run = (command, args, options = {}) =>
  (
    execFileSync(command, args, {
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
      ...options,
    }) ?? ''
  ).trim()
export const git = args => run('git', args)
export const readJson = path => JSON.parse(readFileSync(path, 'utf8'))
export const loadConfig = () => readJson('release.config.json')
export const tagOf = (name, version) => `${name}@${version}`
export const isMain = url => process.argv[1] && url === pathToFileURL(process.argv[1]).href

export function versionParts(value) {
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(value))
    throw new Error(`Invalid stable version: ${value}`)
  const parts = value.split('.').map(Number)
  if (parts.some(part => !Number.isSafeInteger(part))) throw new Error(`Invalid version: ${value}`)
  return parts
}

export function compareVersions(a, b) {
  const left = versionParts(a)
  const right = versionParts(b)
  for (let i = 0; i < 3; i++) {
    if (left[i] !== right[i]) return left[i] - right[i]
  }
  return 0
}

export function bumpVersion(version, level) {
  const parts = versionParts(version)
  if (!levels.includes(level)) throw new Error(`Unknown bump: ${level}`)
  const index = 2 - levels.indexOf(level)
  parts[index] += 1
  parts.fill(0, index + 1)
  const result = parts.join('.')
  versionParts(result)
  return result
}

export function parseChange(raw, file, config) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(raw)
  if (!match) throw new Error(`${file}: missing frontmatter`)
  const meta = {}
  for (const line of match[1].split(/\r?\n/).filter(line => line.trim())) {
    const pair = /^(type|scope|level):\s*(.+)$/.exec(line)
    if (!pair || Object.hasOwn(meta, pair[1])) throw new Error(`${file}: invalid metadata: ${line}`)
    meta[pair[1]] = pair[2].trim()
  }
  if (!config.sections.some(section => section.type === meta.type))
    throw new Error(`${file}: unknown change type: ${meta.type}`)
  if (!meta.scope || /[\r\n*]/.test(meta.scope)) throw new Error(`${file}: invalid scope`)
  if (meta.level && !levels.includes(meta.level)) throw new Error(`${file}: invalid level`)
  const text = match[2].trim()
  if (!text) throw new Error(`${file}: empty note`)
  return { file, ...meta, text }
}

export function readChanges(config) {
  if (!existsSync(config.changesDir)) return []
  return readdirSync(config.changesDir)
    .filter(name => name.endsWith('.md') && name !== 'README.md')
    .sort()
    .map(name => {
      const file = join(config.changesDir, name)
      return parseChange(readFileSync(file, 'utf8'), file, config)
    })
}

export function nextVersion(current, changes, config, options = {}) {
  let required = config.defaultBump
  if (!levels.includes(required)) throw new Error('Invalid default bump')
  for (const change of changes) {
    if (levels.indexOf(change.level) > levels.indexOf(required)) required = change.level
  }
  const level = options.bump ?? required
  if (!levels.includes(level)) throw new Error(`Unknown bump: ${level}`)
  if (levels.indexOf(level) < levels.indexOf(required))
    throw new Error(`Changes require at least a ${required} release`)
  const minimum = bumpVersion(current, level)
  const version = options.version ?? minimum
  if (compareVersions(version, minimum) < 0) throw new Error(`Version must be at least ${minimum}`)
  return version
}

export function renderNotes(changes, config) {
  const lines = []
  for (const section of config.sections) {
    const entries = changes.filter(change => change.type === section.type)
    if (!entries.length) continue
    lines.push(`### ${section.title}`, '')
    for (const change of entries) {
      const [first, ...rest] = change.text.split(/\r?\n/)
      lines.push(`- **${change.scope}** ${first}`, ...rest.map(line => (line ? `  ${line}` : '')))
    }
    lines.push('')
  }
  return `${lines.join('\n').trimEnd()}\n`
}

export function releaseNotes(changelog, version) {
  const sections = changelog.split(/^## /m).slice(1)
  const section = sections.find(
    section => section.startsWith(`[${version}](`) || section.startsWith(`${version}\n`),
  )
  if (!section) throw new Error(`Missing changelog for ${version}`)
  const notes = section.slice(section.indexOf('\n') + 1).trim()
  if (!notes) throw new Error(`Empty changelog for ${version}`)
  return `${notes}\n`
}

export function parseOptions(args, allowed) {
  const options = {}
  for (const arg of args) {
    const match = /^--([a-z-]+)(?:=(.*))?$/.exec(arg)
    if (!match || !allowed.includes(match[1]) || Object.hasOwn(options, match[1]))
      throw new Error(`Unknown or duplicate option: ${arg}`)
    const [, key, value] = match
    if (['dry', 'check'].includes(key)) {
      if (value !== undefined) throw new Error(`--${key} takes no value`)
      options[key] = true
    } else {
      if (!value) throw new Error(`--${key} requires a value`)
      options[key] = value
    }
  }
  return options
}
