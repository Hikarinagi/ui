import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import {
  chmodSync,
  existsSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
  mkdirSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import {
  bumpVersion,
  compareVersions,
  nextVersion,
  parseChange,
  parseOptions,
  readChanges,
  releaseNotes,
  renderNotes,
} from './lib.mjs'
import { applyRelease, planRelease } from './prepare.mjs'
import {
  assertCI,
  assertRegistry,
  checkRelease,
  publishRelease,
  releaseCandidate,
} from './publish.mjs'

const config = JSON.parse(readFileSync(new URL('../../release.config.json', import.meta.url)))
const scripts = dirname(fileURLToPath(import.meta.url))
const note = { type: 'added', scope: 'Dialog', text: 'Add a title slot.' }
const sha = 'a'.repeat(40)
const candidate = {
  config,
  pkg: { name: '@hina-ui/vue', version: '1.7.1' },
  tag: '@hina-ui/vue@1.7.1',
  sha,
  notes: '### 修复\n\n- **Dialog** Fix focus.\n',
}
const passing = {
  head_sha: sha,
  head_branch: 'main',
  head_repository: { full_name: config.repo },
  event: 'push',
  run_number: 20,
  run_attempt: 1,
  status: 'completed',
  conclusion: 'success',
}

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'hina-release-test-'))
  const original = process.cwd()
  t.after(() => {
    process.chdir(original)
    rmSync(root, { recursive: true, force: true })
  })
  const write = (path, content) => {
    mkdirSync(dirname(join(root, path)), { recursive: true })
    writeFileSync(join(root, path), content)
  }
  const git = args =>
    execFileSync('git', args, { cwd: root, encoding: 'utf8', stdio: 'pipe' }).trim()
  const commit = message => {
    git(['add', '.'])
    git(['commit', '-m', message])
  }
  git(['init', '-b', 'main'])
  git(['config', 'commit.gpgsign', 'false'])
  git(['config', 'tag.gpgsign', 'false'])
  git(['config', 'user.name', 'Release Test'])
  git(['config', 'user.email', 'release@example.invalid'])
  write('release.config.json', JSON.stringify(config))
  write(
    config.package,
    JSON.stringify({ name: candidate.pkg.name, version: '1.7.0' }, null, 2) + '\n',
  )
  write(
    config.changelog,
    '# @hina-ui/vue\n\n## 1.7.0\n\n### Minor Changes\n\n- Existing history.\n',
  )
  write('.changes/README.md', 'Change records')
  commit('baseline')
  process.chdir(root)
  return { root, write, git, commit }
}

function record(type = 'added', level) {
  return `---\ntype: ${type}\nscope: Dialog\n${level ? `level: ${level}\n` : ''}---\n\nAdd a title slot.\n`
}

function publication(overrides = {}) {
  const calls = []
  let npm = false
  let tag = null
  let release = null
  const io = {
    github(path) {
      return path.includes('/actions/') ? { workflow_runs: [passing] } : release
    },
    registry: async () => ({ versions: npm ? { '1.7.1': { gitHead: sha } } : {} }),
    tagCommit: () => tag,
    publish: async () => {
      calls.push('npm')
      npm = true
    },
    pushTag: async () => {
      calls.push('tag')
      tag = sha
    },
    createRelease: async () => {
      calls.push('release')
      release = { id: 1 }
    },
    ...overrides,
  }
  return { calls, io }
}

test('added and changed records default to patch independently of their changelog sections', () => {
  assert.equal(nextVersion('1.7.0', [note, { ...note, type: 'changed' }], config), '1.7.1')
  assert.equal(nextVersion('1.7.9', [note], config), '1.7.10')
})

test('explicit levels and release overrides select the strongest required version', () => {
  assert.equal(
    nextVersion(
      '1.7.2',
      [
        { ...note, level: 'minor' },
        { ...note, level: 'major' },
      ],
      config,
    ),
    '2.0.0',
  )
  assert.equal(nextVersion('1.7.2', [note], config, { bump: 'minor' }), '1.8.0')
  assert.equal(nextVersion('1.7.2', [note], config, { version: '1.9.0' }), '1.9.0')
  assert.throws(() =>
    nextVersion('1.7.2', [{ ...note, level: 'major' }], config, { bump: 'patch' }),
  )
  assert.throws(() =>
    nextVersion('1.7.2', [{ ...note, level: 'major' }], config, { version: '1.9.0' }),
  )
  assert.throws(() => nextVersion('1.7.2', [note], config, { version: '1.7.2' }))
})

test('version arithmetic validates stable semver and carries only the selected field', () => {
  assert.equal(bumpVersion('1.9.99', 'minor'), '1.10.0')
  assert.equal(bumpVersion('1.9.99', 'major'), '2.0.0')
  assert.ok(compareVersions('1.10.0', '1.9.99') > 0)
  for (const invalid of ['1.2', '01.2.3', '1.2.3-beta', '-1.2.3', '9007199254740992.0.0'])
    assert.throws(() => bumpVersion(invalid, 'patch'))
  assert.throws(() => bumpVersion('1.2.3', 'tiny'))
  assert.throws(() => bumpVersion('1.2.9007199254740991', 'patch'))
})

test('change records reject malformed or ambiguous metadata before writing', () => {
  assert.equal(parseChange(record().replaceAll('\n', '\r\n'), 'note', config).scope, 'Dialog')
  for (const raw of [
    'no frontmatter',
    record('unknown'),
    record('added', 'tiny'),
    record().replace('scope: Dialog', 'scope: Dialog\nlevel: major\nlevel: patch'),
    record().replace('scope: Dialog', 'target: vue'),
    record().replace('Add a title slot.', ''),
  ])
    assert.throws(() => parseChange(raw, 'note', config))
})

test('changelog groups notes by type and retains paragraphs and existing legacy notes', () => {
  const notes = renderNotes(
    [note, { type: 'fixed', scope: 'Image', text: 'Fix sizing.\n\nKeep explicit bounds.' }],
    config,
  )
  assert.ok(notes.includes('### 新增\n\n- **Dialog** Add a title slot.'))
  assert.ok(notes.includes('### 修复\n\n- **Image** Fix sizing.\n\n  Keep explicit bounds.'))
  assert.equal(
    releaseNotes('## 1.7.0\n\nPrevious notes.\n\n## 1.6.0\n\nOlder.', '1.7.0'),
    'Previous notes.\n',
  )
  assert.throws(() => releaseNotes('## 1.7.0\n\n', '1.7.0'))
})

test('CLI options reject typos, repeated values and missing arguments', () => {
  assert.deepEqual(parseOptions(['--dry', '--version=1.8.0'], ['dry', 'version']), {
    dry: true,
    version: '1.8.0',
  })
  for (const args of [['--bump'], ['--bump=patch', '--bump=minor'], ['--dry=false'], ['--unknown']])
    assert.throws(() => parseOptions(args, ['dry', 'bump']))
})

test('preview is read-only; preparation consumes records once and preserves changelog history', t => {
  const f = fixture(t)
  f.write('.changes/dialog.md', record())
  f.commit('add record')
  const output = execFileSync(process.execPath, [join(scripts, 'prepare.mjs'), '--dry'], {
    encoding: 'utf8',
  })
  assert.match(output, /1\.7\.0 -> 1\.7\.1/)
  assert.equal(f.git(['status', '--porcelain']), '')
  const plan = planRelease()
  applyRelease(plan)
  assert.equal(JSON.parse(readFileSync(config.package)).version, '1.7.1')
  assert.ok(readFileSync(config.changelog, 'utf8').includes('Existing history.'))
  assert.equal(releaseNotes(readFileSync(config.changelog, 'utf8'), '1.7.1'), plan.notes)
  assert.equal(existsSync('.changes/dialog.md'), false)
  assert.equal(existsSync('.changes/README.md'), true)
  assert.equal(planRelease(), null)
})

test('an invalid record prevents all version and changelog changes', t => {
  const f = fixture(t)
  f.write('.changes/valid.md', record())
  f.write('.changes/invalid.md', 'invalid')
  f.commit('records')
  assert.throws(() => planRelease())
  assert.equal(f.git(['status', '--porcelain']), '')
  assert.equal(existsSync('.changes/valid.md'), true)
})

test('no records do not bump versions and existing version tags cannot be reused', t => {
  const f = fixture(t)
  assert.equal(planRelease({ bump: 'minor' }), null)
  f.write('.changes/dialog.md', record())
  f.git(['tag', '@hina-ui/vue@1.7.1'])
  assert.throws(() => planRelease(), /Tag already exists/)
})

test('only the version-changing commit becomes a release candidate, including merge commits', t => {
  const f = fixture(t)
  f.write('.changes/dialog.md', record())
  f.commit('add capability')
  assert.equal(releaseCandidate(), null)
  f.git(['checkout', '-b', 'release/next'])
  applyRelease(planRelease())
  f.commit('prepare release')
  assert.equal(releaseCandidate().pkg.version, '1.7.1')
  f.git(['checkout', 'main'])
  f.write('other.txt', 'another change')
  f.commit('other work')
  f.git(['merge', '--no-ff', 'release/next', '-m', 'Merge release'])
  assert.equal(releaseCandidate().sha, f.git(['rev-parse', 'HEAD']))
  f.write('other.txt', 'later change')
  f.commit('later work')
  assert.equal(releaseCandidate(), null)
})

test('change CLI validates input and writes independently classified notes', t => {
  fixture(t)
  execFileSync(process.execPath, [join(scripts, 'change.mjs'), 'added', 'Select', 'Add an option.'])
  const records = readChanges(config)
  assert.equal(records.length, 1)
  assert.equal(records[0].scope, 'Select')
  assert.equal(records[0].level, undefined)
  assert.throws(() =>
    execFileSync(
      process.execPath,
      [join(scripts, 'change.mjs'), 'fixed', 'Bad\nlevel: major', 'note'],
      { stdio: 'pipe' },
    ),
  )
  assert.equal(readChanges(config).length, 1)
})

test('CI must pass on this exact main commit, not a PR or another revision', () => {
  assert.doesNotThrow(() => assertCI([passing], sha, config.repo))
  for (const difference of [
    { head_sha: 'b'.repeat(40) },
    { head_branch: 'dev' },
    { event: 'pull_request' },
    { head_repository: { full_name: 'other/ui' } },
    { conclusion: 'failure' },
    { status: 'in_progress' },
  ])
    assert.throws(() => assertCI([{ ...passing, ...difference }], sha, config.repo))
  assert.throws(() => assertCI([], sha, config.repo))
})

test('newer CI failures or running retries supersede a previous success', () => {
  assert.throws(() =>
    assertCI([passing, { ...passing, run_number: 21, conclusion: 'failure' }], sha, config.repo),
  )
  assert.throws(() =>
    assertCI([passing, { ...passing, run_attempt: 2, status: 'in_progress' }], sha, config.repo),
  )
})

test('existing npm versions must belong to this commit and latest cannot move backward', () => {
  assert.equal(assertRegistry({ versions: { '1.7.1': { gitHead: sha } } }, candidate), true)
  assert.throws(() => assertRegistry({ versions: { '1.7.1': {} } }, candidate))
  assert.throws(() => assertRegistry({ versions: { '1.7.1': { gitHead: 'other' } } }, candidate))
  assert.throws(() => assertRegistry({ 'dist-tags': { latest: '1.8.0' } }, candidate))
})

test('publication proceeds npm then tag then GitHub and repeating it does no writes', async () => {
  const { calls, io } = publication()
  await publishRelease(candidate, io)
  assert.deepEqual(calls, ['npm', 'tag', 'release'])
  calls.length = 0
  await publishRelease(candidate, io)
  assert.deepEqual(calls, [])
})

test('failure after npm publication is retryable without publishing npm again', async () => {
  const { calls, io } = publication()
  const create = io.createRelease
  io.createRelease = async () => {
    throw new Error('GitHub unavailable')
  }
  await assert.rejects(publishRelease(candidate, io), /GitHub unavailable/)
  assert.deepEqual(calls, ['npm', 'tag'])
  calls.length = 0
  io.createRelease = create
  await publishRelease(candidate, io)
  assert.deepEqual(calls, ['tag', 'release'])
})

test('registry, CI and tag failures stop publishing without swallowing errors', async () => {
  for (const override of [
    {
      registry: async () => {
        throw new Error('Registry unavailable')
      },
    },
    { tagCommit: () => 'other' },
    { github: () => ({ workflow_runs: [{ ...passing, conclusion: 'failure' }] }) },
  ]) {
    const { calls, io } = publication(override)
    await assert.rejects(checkRelease(candidate, io))
    assert.deepEqual(calls, [])
  }
})

test('release PR updates retain manual versions, refresh notes and recover a missed CI dispatch', t => {
  const f = fixture(t)
  const remote = join(f.root, '.git', 'remote.git')
  f.git(['init', '--bare', remote])
  f.git(['remote', 'add', 'origin', remote])
  f.write('.changes/dialog.md', record())
  f.commit('add record')
  f.git(['push', 'origin', 'main'])
  const stateFile = join(f.root, '.git', 'fake-gh.json')
  const stub = join(f.root, '.git', 'bin', 'gh')
  const source = `#!/usr/bin/env node
const fs = require('node:fs')
const file = process.env.GH_FAKE_STATE
const state = fs.existsSync(file) ? JSON.parse(fs.readFileSync(file)) : { pulls: [], runs: [], dispatches: 0 }
const args = process.argv.slice(2)
if (args[0] === 'api') {
  if (args[1].includes('/actions/')) console.log(JSON.stringify({ workflow_runs: state.runs }))
  else console.log(JSON.stringify(state.pulls))
} else if (args[0] === 'pr') {
  state.pulls = [{ number: 1 }]
  state.body = fs.readFileSync(args[args.indexOf('--body-file') + 1], 'utf8')
  fs.writeFileSync(file, JSON.stringify(state))
} else if (args[0] === 'workflow') {
  if (process.env.GH_FAKE_FAIL_CI === 'true') process.exit(1)
  state.dispatches++
  fs.writeFileSync(file, JSON.stringify(state))
} else process.exit(2)
`
  f.write('.git/bin/gh', source)
  chmodSync(stub, 0o755)
  const invoke = (extra = {}) =>
    execFileSync(process.execPath, [join(scripts, 'pr.mjs')], {
      encoding: 'utf8',
      stdio: 'pipe',
      env: {
        ...process.env,
        PATH: `${dirname(stub)}:${process.env.PATH}`,
        GITHUB_ACTIONS: 'true',
        GITHUB_REPOSITORY: config.repo,
        GITHUB_REF: 'refs/heads/main',
        GH_FAKE_STATE: stateFile,
        BUMP: 'auto',
        RELEASE_VERSION: '',
        ...extra,
      },
    })
  const version = () =>
    JSON.parse(f.git(['show', `refs/remotes/origin/${config.branch}:${config.package}`])).version
  assert.throws(() => invoke({ BUMP: 'minor', GH_FAKE_FAIL_CI: 'true' }))
  assert.equal(version(), '1.8.0')
  f.git(['checkout', 'main'])
  invoke()
  assert.equal(version(), '1.8.0')
  assert.equal(JSON.parse(readFileSync(stateFile)).dispatches, 1)
  f.git(['reset', '--hard', 'HEAD'])
  f.write('.changes/image.md', record('fixed').replaceAll('Dialog', 'Image'))
  f.commit('add fix')
  f.git(['push', 'origin', 'main'])
  invoke()
  assert.equal(version(), '1.8.0')
  const updated = JSON.parse(readFileSync(stateFile))
  assert.ok(updated.body.includes('**Dialog**'))
  assert.ok(updated.body.includes('**Image**'))
  assert.equal(updated.dispatches, 2)
  f.git(['checkout', 'main'])
  invoke({ BUMP: 'patch' })
  assert.equal(version(), '1.7.1')
})

test('backfilling an older GitHub release does not replace the latest release', async () => {
  let latest
  const { calls, io } = publication({
    registry: async () => ({
      versions: { '1.7.1': { gitHead: sha } },
      'dist-tags': { latest: '1.8.0' },
    }),
    createRelease: async (_candidate, value) => {
      latest = value
    },
  })
  await publishRelease(candidate, io)
  assert.equal(latest, false)
  assert.deepEqual(calls, ['tag'])
})
