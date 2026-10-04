import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs'
import {
  appliesTo,
  git,
  isMain,
  loadConfig,
  lockstepNote,
  nextVersion,
  parseOptions,
  readChanges,
  readJson,
  releasePackages,
  renderNotes,
  tagOf,
} from './lib.mjs'

export function planRelease(options = {}, config = loadConfig()) {
  const changes = readChanges(config)
  if (!changes.length) return null
  const entries = releasePackages(config).map(entry => ({ ...entry, pkg: readJson(entry.package) }))
  const problems = entries
    .filter(({ pkg }) => pkg.private || !pkg.name)
    .map(entry => `${entry.pkg.name ?? entry.package} is private or unnamed in ${entry.package}`)
  const versions = [...new Set(entries.map(({ pkg }) => pkg.version))]
  if (versions.length > 1)
    problems.push(
      `Packages must share one version: ${entries.map(({ pkg }) => `${pkg.name} ${pkg.version}`).join(', ')}`,
    )
  if (problems.length)
    throw new Error(`Cannot plan a lockstep release:\n- ${problems.join('\n- ')}`)
  const current = versions[0]
  const version = nextVersion(current, changes, config, options)
  const date = new Date().toISOString().slice(0, 10)
  const packages = entries.map(entry => {
    const { pkg } = entry
    const tag = tagOf(pkg.name, version)
    if (git(['tag', '--list', tag])) throw new Error(`Tag already exists: ${tag}`)
    const previous = tagOf(pkg.name, current)
    const first = !git(['tag', '--list', previous])
    const link = first
      ? `https://github.com/${config.repo}/tree/${tag}`
      : `https://github.com/${config.repo}/compare/${previous}...${tag}`
    const own = changes.filter(change => appliesTo(change, entry.id))
    const notes = own.length ? renderNotes(own, config) : `${lockstepNote}\n`
    const heading = `# ${pkg.name}`
    const existing = existsSync(entry.changelog) ? readFileSync(entry.changelog, 'utf8') : heading
    const rest = existing.replace(/^#[^\n]*(?:\r?\n|$)/, '').trimStart()
    const history = `${heading}\n\n## [${version}](${link}) (${date})\n\n${notes}${rest ? `\n${rest}` : ''}`
    return { ...entry, tag, first, changes: own, notes, history }
  })
  return {
    config,
    changes,
    current,
    version,
    packages,
    title: `chore(release): ${packages.map(entry => entry.tag).join(', ')}`,
    notes: packages.map(entry => `## ${entry.pkg.name}\n\n${entry.notes}`).join('\n'),
  }
}

export function applyRelease(plan) {
  for (const entry of plan.packages) {
    writeFileSync(
      entry.package,
      `${JSON.stringify({ ...entry.pkg, version: plan.version }, null, 2)}\n`,
    )
    writeFileSync(entry.changelog, entry.history)
  }
  for (const change of plan.changes) unlinkSync(change.file)
}

export function describePlan(plan) {
  const summary = plan.packages.map(
    entry =>
      `${entry.pkg.name}: ${plan.current} -> ${plan.version}${entry.first ? ' (first release)' : ''}`,
  )
  return `${summary.join('\n')}\n\n${plan.notes}`
}

if (isMain(import.meta.url)) {
  try {
    const options = parseOptions(process.argv.slice(2), ['dry', 'bump', 'version'])
    const plan = planRelease(options)
    if (!plan) console.log('Nothing to release')
    else {
      console.log(describePlan(plan))
      if (!options.dry) applyRelease(plan)
    }
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
