import { appendFileSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import {
  compareVersions,
  git,
  isMain,
  loadConfig,
  manifestAt,
  parseOptions,
  readJson,
  releaseNotes,
  releasePackages,
  run,
  tagOf,
} from './lib.mjs'

export function isReleaseCommit({ config, sha }, io = services) {
  const pulls = io.github(`repos/${config.repo}/commits/${sha}/pulls?per_page=100`)
  return pulls.some(
    pull =>
      pull.merged_at &&
      pull.merge_commit_sha === sha &&
      pull.base?.ref === 'main' &&
      pull.base.repo?.full_name === config.repo &&
      pull.head?.ref === config.branch &&
      pull.head.repo?.full_name === config.repo,
  )
}

export function releaseCandidates(config = loadConfig(), io = services) {
  const changed = []
  for (const entry of releasePackages(config)) {
    const pkg = readJson(entry.package)
    const previous = manifestAt('HEAD^', entry.package)
    if (!previous || pkg.version === previous.version || (pkg.private && previous.private)) continue
    if (
      pkg.private ||
      pkg.name !== previous.name ||
      compareVersions(pkg.version, previous.version) <= 0
    )
      throw new Error(
        `Release must keep ${entry.package} public and named ${previous.name} and increase its version`,
      )
    changed.push({ entry, pkg, first: Boolean(previous.private) })
  }
  if (!changed.length) return null
  const sha = git(['rev-parse', 'HEAD'])
  if (!isReleaseCommit({ config, sha }, io)) return null
  return {
    config,
    sha,
    packages: changed.map(({ entry, pkg, first }) => ({
      config,
      sha,
      id: entry.id,
      manifest: entry.package,
      pkg,
      first,
      tag: tagOf(pkg.name, pkg.version),
      notes: releaseNotes(readFileSync(entry.changelog, 'utf8'), pkg.version),
    })),
  }
}

export function assertCI(runs, sha, repo) {
  const relevant = runs
    .filter(
      item =>
        item.head_sha === sha &&
        item.head_branch === 'main' &&
        item.head_repository?.full_name === repo &&
        ['push', 'workflow_dispatch'].includes(item.event),
    )
    .sort((a, b) => b.run_number - a.run_number || b.run_attempt - a.run_attempt)
  if (
    !relevant.length ||
    relevant[0].status !== 'completed' ||
    relevant[0].conclusion !== 'success'
  )
    throw new Error(`CI has not passed for ${sha}`)
}

export function assertRegistry(metadata, candidate) {
  const published = metadata.versions?.[candidate.pkg.version]
  if (published && published.gitHead !== candidate.sha)
    throw new Error(`${candidate.tag} is already published from a different or unknown commit`)
  const latest = metadata['dist-tags']?.latest
  if (!published && latest && compareVersions(latest, candidate.pkg.version) >= 0)
    throw new Error(`Publishing ${candidate.pkg.version} would replace newer latest ${latest}`)
  return Boolean(published)
}

export function github(path, missing = false) {
  try {
    return JSON.parse(run('gh', ['api', path]))
  } catch (error) {
    if (missing && /\(HTTP 404\)/.test(String(error.stderr))) return null
    throw error
  }
}

async function registry(name) {
  const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`, {
    signal: AbortSignal.timeout(30000),
  })
  if (response.status === 404) return {}
  if (!response.ok) throw new Error(`npm registry returned ${response.status}`)
  return response.json()
}

export function pushReleaseTag(candidate) {
  if (!git(['tag', '--list', candidate.tag]))
    git([
      '-c',
      'user.name=github-actions[bot]',
      '-c',
      'user.email=github-actions[bot]@users.noreply.github.com',
      'tag',
      '--no-sign',
      '-a',
      candidate.tag,
      candidate.sha,
      '-m',
      candidate.tag,
    ])
  run('git', ['push', 'origin', `refs/tags/${candidate.tag}`])
}

const services = {
  github,
  registry,
  tagCommit(tag) {
    if (!git(['tag', '--list', tag])) return null
    return git(['rev-parse', `${tag}^{commit}`])
  },
  publish(candidate) {
    run('npm', ['publish', '--access', 'public', '--provenance'], {
      cwd: dirname(candidate.manifest),
      stdio: 'inherit',
    })
  },
  pushTag: pushReleaseTag,
  createRelease(candidate, latest) {
    const path = join(process.env.RUNNER_TEMP ?? tmpdir(), `hina-release-notes-${candidate.id}.md`)
    writeFileSync(path, candidate.notes)
    run('gh', [
      'release',
      'create',
      candidate.tag,
      '--repo',
      candidate.config.repo,
      '--verify-tag',
      `--latest=${latest}`,
      '--title',
      candidate.tag,
      '--notes-file',
      path,
    ])
  },
}

export async function checkRelease(release, io = services) {
  const { config, sha } = release
  if (!isReleaseCommit(release, io))
    throw new Error(`Commit ${sha} is not a merged ${config.branch} release PR`)
  const runs = io.github(
    `repos/${config.repo}/actions/workflows/ci.yml/runs?head_sha=${sha}&per_page=100`,
  )
  assertCI(runs.workflow_runs, sha, config.repo)
  const states = []
  for (const candidate of release.packages) {
    const { tag } = candidate
    if (candidate.sha !== sha) throw new Error(`${tag} does not belong to ${sha}`)
    const tagged = io.tagCommit(tag)
    if (tagged && tagged !== sha) throw new Error(`Tag ${tag} points to a different commit`)
    const metadata = await io.registry(candidate.pkg.name)
    const published = assertRegistry(metadata, candidate)
    const latest = metadata['dist-tags']?.latest
    const found = io.github(`repos/${config.repo}/releases/tags/${encodeURIComponent(tag)}`, true)
    if (found && !tagged) throw new Error(`Release ${tag} has no matching git tag`)
    states.push({ candidate, published, released: Boolean(found), latest })
  }
  return states
}

export function checkOutput(states) {
  const pending = states.filter(state => !state.published).map(state => state.candidate.pkg.name)
  const candidate = states.some(state => !state.published || !state.released)
  return `candidate=${candidate}\npublish=${pending.length > 0}\npackages=${pending.join(' ')}\n`
}

export async function publishRelease(release, io = services) {
  const states = await checkRelease(release, io)
  const primary = releasePackages(release.config)[0].id
  for (const state of states) if (!state.published) await io.publish(state.candidate)
  for (const { candidate, released, latest } of states) {
    if (released) continue
    await io.pushTag(candidate)
    await io.createRelease(
      candidate,
      candidate.id === primary && (!latest || compareVersions(candidate.pkg.version, latest) >= 0),
    )
  }
  return states
}

if (isMain(import.meta.url)) {
  const options = parseOptions(process.argv.slice(2), ['dry', 'check'])
  const release = releaseCandidates()
  if (!release) {
    console.log('No merged release PR with a version change at this commit; nothing to publish')
    if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, checkOutput([]))
  } else {
    if (git(['status', '--porcelain'])) throw new Error('Publishing requires a clean checkout')
    git(['merge-base', '--is-ancestor', release.sha, 'origin/main'])
    if (options.dry)
      console.log(
        release.packages
          .map(candidate => `${candidate.tag} at ${candidate.sha}\n\n${candidate.notes}`)
          .join('\n'),
      )
    else {
      if (
        process.env.GITHUB_ACTIONS !== 'true' ||
        process.env.GITHUB_REPOSITORY !== release.config.repo
      )
        throw new Error('Publishing runs in the repository Release workflow')
      if (options.check) {
        const states = await checkRelease(release)
        if (process.env.GITHUB_OUTPUT)
          appendFileSync(process.env.GITHUB_OUTPUT, checkOutput(states))
        for (const { candidate, published, released } of states)
          console.log(
            `${candidate.tag}: npm=${published}, GitHub=${released}${candidate.first ? ' (first release)' : ''}`,
          )
      } else {
        await publishRelease(release)
        console.log(`Published ${release.packages.map(candidate => candidate.tag).join(', ')}`)
      }
    }
  }
}
