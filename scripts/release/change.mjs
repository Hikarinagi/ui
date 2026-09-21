import { randomBytes } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { levels, loadConfig, parseChange } from './lib.mjs'

const config = loadConfig()
const types = config.sections.map(section => section.type)
const usage = `Usage: pnpm change:add <${types.join('|')}> <scope> "<note>" [${levels.join('|')}]

Example: pnpm change:add added Dialog "Add a title slot."
Write release notes in English. The default version bump is ${config.defaultBump}.`
const args = process.argv.slice(2)

if (args.length === 1 && ['--help', '-h'].includes(args[0])) console.log(usage)
else {
  try {
    const [type, scope, text, level, ...extra] = args
    if (extra.length) throw new Error('Too many arguments.')
    if (!types.includes(type)) throw new Error(`Unknown change type: ${type ?? '(missing)'}.`)
    if (!scope?.trim() || /[\r\n]/.test(scope)) throw new Error('A single-line scope is required.')
    if (!text?.trim()) throw new Error('A release note is required.')
    if (level && !levels.includes(level)) throw new Error(`Unknown release level: ${level}.`)
    const file = join(config.changesDir, `${randomBytes(4).toString('hex')}.md`)
    const meta = [`type: ${type}`, `scope: ${scope.trim()}`]
    if (level) meta.push(`level: ${level}`)
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
