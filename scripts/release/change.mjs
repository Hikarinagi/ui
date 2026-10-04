import { randomBytes } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { levels, loadConfig, parseChange, releasePackages } from './lib.mjs'

const config = loadConfig()
const types = config.sections.map(section => section.type)
const ids = releasePackages(config).map(entry => entry.id)
const usage = `Usage: pnpm change:add <${types.join('|')}> <scope> "<note>" [${levels.join('|')}] [--package <${ids.join('|')}>]

Example: pnpm change:add added Dialog "Add a title slot."
Example: pnpm change:add fixed FormField "Fix the hint animation." --package ${ids[0]}
A record applies to every package (${ids.join(', ')}) unless --package restricts it.
Repeat --package or separate ids with commas to select several packages.
Write release notes in English. The default version bump is ${config.defaultBump}.`
const args = process.argv.slice(2)

function parseArgs(args) {
  const positional = []
  const selected = new Set()
  for (let index = 0; index < args.length; index++) {
    const option = /^--package(?:=(.*))?$/.exec(args[index])
    if (option) {
      const value = option[1] ?? args[++index]
      for (const id of (value ?? '').split(',').map(id => id.trim())) {
        if (!ids.includes(id)) throw new Error(`Unknown package: ${id || '(missing)'}.`)
        selected.add(id)
      }
    } else if (args[index].startsWith('--')) throw new Error(`Unknown option: ${args[index]}.`)
    else positional.push(args[index])
  }
  return { positional, packages: ids.filter(id => selected.has(id)) }
}

if (args.length === 1 && ['--help', '-h'].includes(args[0])) console.log(usage)
else {
  try {
    const { positional, packages } = parseArgs(args)
    const [type, scope, text, level, ...extra] = positional
    if (extra.length) throw new Error('Too many arguments.')
    if (!types.includes(type)) throw new Error(`Unknown change type: ${type ?? '(missing)'}.`)
    if (!scope?.trim() || /[\r\n]/.test(scope)) throw new Error('A single-line scope is required.')
    if (!text?.trim()) throw new Error('A release note is required.')
    if (level && !levels.includes(level)) throw new Error(`Unknown release level: ${level}.`)
    const file = join(config.changesDir, `${randomBytes(4).toString('hex')}.md`)
    const meta = [`type: ${type}`, `scope: ${scope.trim()}`]
    if (level) meta.push(`level: ${level}`)
    if (packages.length)
      meta.push(`packages: ${packages.length === 1 ? packages[0] : `[${packages.join(', ')}]`}`)
    const content = `---\n${meta.join('\n')}\n---\n\n${text.trim()}\n`
    parseChange(content, file, config)
    mkdirSync(config.changesDir, { recursive: true })
    writeFileSync(file, content, { flag: 'wx' })
    console.log(file)
  } catch (error) {
    console.error(error.message)
    console.error(usage)
    process.exitCode = 1
  }
}
