import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { compareVersions, git, loadConfig, manifestAt, releasePackages, run } from './lib.mjs'
import { applyRelease, planRelease } from './prepare.mjs'
import { github } from './publish.mjs'

const config = loadConfig()
const entries = releasePackages(config)
if (process.env.GITHUB_ACTIONS !== 'true' || process.env.GITHUB_REPOSITORY !== config.repo)
  throw new Error('Release PR preparation runs in the repository Release workflow')
if (process.env.GITHUB_REF !== 'refs/heads/main') throw new Error('Prepare releases from main')
if (git(['status', '--porcelain'])) throw new Error('Release preparation requires a clean checkout')
const head = git(['rev-parse', 'HEAD'])
const main = () => git(['ls-remote', 'origin', 'refs/heads/main']).split(/\s/)[0]
if (main() !== head) throw new Error('main advanced; use its latest Release run')
const remote = `refs/heads/${config.branch}`
const previousHead = git(['ls-remote', 'origin', remote]).split(/\s/)[0]
const options = {}
if (process.env.BUMP && process.env.BUMP !== 'auto') options.bump = process.env.BUMP
if (process.env.RELEASE_VERSION) options.version = process.env.RELEASE_VERSION
let plan = planRelease(options, config)
if (!plan) {
  console.log('Nothing to release')
  process.exit(0)
}
const pulls = github(
  `repos/${config.repo}/pulls?state=open&base=main&head=${config.repo.split('/')[0]}:${config.branch}`,
)
const pull = pulls[0]
if (pull && previousHead && !options.bump && !options.version) {
  git(['fetch', 'origin', remote])
  const base = git(['merge-base', head, previousHead])
  const sharedVersion = commit => {
    const versions = new Set(
      entries.map(entry => manifestAt(commit, entry.package)?.version).filter(Boolean),
    )
    return versions.size === 1 ? [...versions][0] : null
  }
  const selected = sharedVersion(previousHead)
  if (
    sharedVersion(base) === plan.current &&
    selected &&
    compareVersions(selected, plan.version) > 0
  )
    plan = planRelease({ version: selected }, config)
}
applyRelease(plan)
const paths = [...entries.flatMap(entry => [entry.package, entry.changelog]), config.changesDir]
git(['add', '--', ...paths])
const changed =
  !pull || !previousHead || Boolean(git(['diff', '--cached', previousHead, '--', ...paths]))
if (changed) {
  git(['checkout', '-B', config.branch])
  git(['commit', '-m', plan.title])
  if (main() !== head) throw new Error('main advanced; use its latest Release run')
  run('git', ['push', `--force-with-lease=${remote}:${previousHead}`, 'origin', `HEAD:${remote}`])
}
const directory = mkdtempSync(join(tmpdir(), 'hina-release-pr-'))
const bodyFile = join(directory, 'body.md')
writeFileSync(
  bodyFile,
  `发布 ${plan.current} → ${plan.version}\n\n${plan.notes}\n合并后，发布提交的 CI 通过才会发布 npm。\n`,
)
const title = plan.title
if (pull)
  run('gh', [
    'pr',
    'edit',
    String(pull.number),
    '--repo',
    config.repo,
    '--title',
    title,
    '--body-file',
    bodyFile,
  ])
else
  run('gh', [
    'pr',
    'create',
    '--repo',
    config.repo,
    '--base',
    'main',
    '--head',
    config.branch,
    '--title',
    title,
    '--body-file',
    bodyFile,
  ])
const branchHead = git(['ls-remote', 'origin', remote]).split(/\s/)[0]
const checks = github(
  `repos/${config.repo}/actions/workflows/ci.yml/runs?head_sha=${branchHead}&per_page=100`,
)
if (
  changed ||
  !checks.workflow_runs.some(
    item => item.head_sha === branchHead && item.head_branch === config.branch,
  )
)
  run('gh', ['workflow', 'run', 'ci.yml', '--repo', config.repo, '--ref', config.branch])
console.log(`${changed ? 'Updated' : 'Unchanged'} release PR: ${plan.title}`)
