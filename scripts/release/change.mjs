import { randomBytes } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { loadConfig, parseChange } from './lib.mjs'

const [type, scope, text, level, ...extra] = process.argv.slice(2)
if (!type || !scope || !text || extra.length || /[\r\n]/.test(scope))
  throw new Error('Usage: pnpm change <type> <scope> "<note>" [patch|minor|major]')
const config = loadConfig()
const file = join(config.changesDir, `${randomBytes(4).toString('hex')}.md`)
const meta = [`type: ${type}`, `scope: ${scope}`]
if (level) meta.push(`level: ${level}`)
const content = `---\n${meta.join('\n')}\n---\n\n${text.trim()}\n`
parseChange(content, file, config)
mkdirSync(config.changesDir, { recursive: true })
writeFileSync(file, content)
console.log(file)
