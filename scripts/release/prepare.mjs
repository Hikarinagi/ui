import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import {
  git,
  isMain,
  loadConfig,
  nextVersion,
  parseOptions,
  readChanges,
  readJson,
  renderNotes,
  tagOf,
} from './lib.mjs'

export function planRelease(options = {}, config = loadConfig()) {
  const changes = readChanges(config)
  if (!changes.length) return null
  const pkg = readJson(config.package)
  if (pkg.private || !pkg.name) throw new Error('Release package must be public and named')
  const version = nextVersion(pkg.version, changes, config, options)
  const tag = tagOf(pkg.name, version)
  if (git(['tag', '--list', tag])) throw new Error(`Tag already exists: ${tag}`)
  const notes = renderNotes(changes, config)
  const date = new Date().toISOString().slice(0, 10)
  const previous = tagOf(pkg.name, pkg.version)
  const compare = `https://github.com/${config.repo}/compare/${previous}...${tag}`
  const heading = `# ${pkg.name}`
  const existing = existsSync(config.changelog) ? readFileSync(config.changelog, 'utf8') : heading
  const rest = existing.replace(/^#[^\n]*(?:\r?\n|$)/, '').trimStart()
  const changelog = `${heading}\n\n## [${version}](${compare}) (${date})\n\n${notes}\n${rest}`
  return { config, changes, pkg, version, tag, notes, changelog }
}

export function applyRelease(plan) {
  writeFileSync(
    plan.config.package,
    `${JSON.stringify({ ...plan.pkg, version: plan.version }, null, 2)}\n`,
  )
  writeFileSync(plan.config.changelog, plan.changelog)
  for (const change of plan.changes) unlinkSync(change.file)
}

if (isMain(import.meta.url)) {
  const options = parseOptions(process.argv.slice(2), ['dry', 'bump', 'version'])
  const plan = planRelease(options)
  if (!plan) console.log('Nothing to release')
  else {
    console.log(`${plan.pkg.name}: ${plan.pkg.version} -> ${plan.version}\n\n${plan.notes}`)
    if (!options.dry) applyRelease(plan)
  }
}
