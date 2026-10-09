import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
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
  lockstepNote,
  nextVersion,
  parseChange,
  parseOptions,
  readChanges,
  releaseNotes,
  releasePackages,
  renderNotes,
} from './lib.mjs'
import { applyRelease, planRelease } from './prepare.mjs'
import {
  assertCI,
  assertRegistry,
  checkOutput,
  checkRelease,
  isReleaseCommit,
  publishRelease,
  releaseCandidates,
} from './publish.mjs'

const config = JSON.parse(readFileSync(new URL('../../release.config.json', import.meta.url)))
const [vue, react] = config.packages
const scripts = dirname(fileURLToPath(import.meta.url))
const home = process.cwd()
const note = { type: 'added', scope: 'Dialog', text: 'Add a title slot.' }
const sha = 'a'.repeat(40)
const tree = tag => `https://github.com/${config.repo}/tree/${tag}`
const compare = (from, to) => `https://github.com/${config.repo}/compare/${from}...${to}`

function candidateFor(id, version = '1.7.1') {
  const name = `@hina-ui/${id}`
  return {
    config,
    sha,
    id,
    manifest: `packages/${id}/package.json`,
    pkg: { name, version },
    first: false,
    tag: `${name}@${version}`,
    notes: '### Fixed\n\n- **Dialog** Fix focus.\n',
  }
}

const candidate = candidateFor('vue')
const releaseOf = (...ids) => ({ config, sha, packages: ids.map(id => candidateFor(id)) })
const single = releaseOf('vue')
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

function releasePull(commit = sha) {
  return {
    merged_at: '2026-09-16T00:00:00Z',
    merge_commit_sha: commit,
    base: { ref: 'main', repo: { full_name: config.repo } },
    head: { ref: config.branch, repo: { full_name: config.repo } },
  }
}

const manifest = (name, version, extra = {}) =>
  `${JSON.stringify({ name, version, ...extra }, null, 2)}\n`
const versionOf = path => JSON.parse(readFileSync(path, 'utf8')).version

function fixture(t, reactManifest = {}) {
  const root = mkdtempSync(join(tmpdir(), 'hina-release-test-'))
  t.after(() => {
    process.chdir(home)
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
  write(vue.package, manifest('@hina-ui/vue', '1.7.0'))
  write(react.package, manifest('@hina-ui/react', '1.7.0', reactManifest))
  write(vue.changelog, '# @hina-ui/vue\n\n## 1.7.0\n\n### Minor Changes\n\n- Existing history.\n')
  write('.changes/README.md', 'Change records')
  commit('baseline')
  process.chdir(root)
  return { root, write, git, commit }
}

function record(type = 'added', level, packages) {
  return `---\ntype: ${type}\nscope: Dialog\n${level ? `level: ${level}\n` : ''}${packages ? `packages: ${packages}\n` : ''}---\n\nAdd a title slot.\n`
}

function publication(overrides = {}) {
  const calls = []
  const npm = new Map()
  const tags = new Set()
  const releases = new Set()
  const io = {
    github(path) {
      if (path.includes('/commits/')) return [releasePull()]
      if (path.includes('/actions/')) return { workflow_runs: [passing] }
      return releases.has(decodeURIComponent(path.split('/releases/tags/')[1])) ? { id: 1 } : null
    },
    registry: async name =>
      npm.has(name) ? { versions: { [npm.get(name)]: { gitHead: sha } } } : {},
    tagCommit: tag => (tags.has(tag) ? sha : null),
    publish: async candidate => {
      calls.push(`npm:${candidate.id}`)
      npm.set(candidate.pkg.name, candidate.pkg.version)
    },
    pushTag: async candidate => {
      calls.push(`tag:${candidate.id}`)
      tags.add(candidate.tag)
    },
    createRelease: async (candidate, latest) => {
      calls.push(`release:${candidate.id}${latest ? ':latest' : ''}`)
      releases.add(candidate.tag)
    },
    ...overrides,
  }
  return { calls, io, npm, tags, releases }
}

test('repository change records conform to the release schema', () => {
  assert.doesNotThrow(() =>
    readChanges({
      ...config,
      changesDir: fileURLToPath(new URL('../../.changes/', import.meta.url)),
    }),
  )
})

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
    record().replace('Add a title slot.', 'Items carry data through CommandItem<T>.'),
    record().replace('Add a title slot.', 'Render it inside <Dialog>.'),
  ])
    assert.throws(() => parseChange(raw, 'note', config))
  for (const note of ['Items carry data through `CommandItem<T>`.', 'Fires when a < b.'])
    assert.equal(
      parseChange(record().replace('Add a title slot.', note), 'note', config).text,
      note,
    )
})

test('change records may restrict themselves to configured packages', () => {
  assert.equal(parseChange(record(), 'note', config).packages, undefined)
  assert.deepEqual(parseChange(record('added', undefined, 'vue'), 'note', config).packages, ['vue'])
  assert.deepEqual(parseChange(record('fixed', 'minor', '[react, vue]'), 'note', config).packages, [
    'react',
    'vue',
  ])
  for (const packages of [
    'angular',
    '[]',
    '[vue, ]',
    '[vue, vue]',
    'vue, react',
    '[vue',
    'vue]',
    '[vue, angular]',
  ])
    assert.throws(
      () => parseChange(record('added', undefined, packages), 'note', config),
      /note: packages must be one of vue, react/,
    )
  assert.throws(() =>
    parseChange(record('added', undefined, 'vue\npackages: react'), 'note', config),
  )
})

test('release config lists packages and still reads the legacy single-package shape', () => {
  assert.deepEqual(
    releasePackages(config).map(entry => entry.id),
    ['vue', 'react'],
  )
  assert.deepEqual(releasePackages({ package: vue.package, changelog: vue.changelog }), [vue])
  for (const invalid of [
    { packages: [] },
    {},
    { packages: [vue], package: vue.package },
    { packages: [vue, { ...react, id: 'vue' }] },
    { packages: [vue, { ...react, package: vue.package }] },
    { packages: [{ ...vue, id: 'Vue' }] },
    { packages: [{ id: 'vue', package: vue.package }] },
  ])
    assert.throws(() => releasePackages(invalid), /release\.config\.json/)
})

test('changelog groups notes by type and retains paragraphs and existing legacy notes', () => {
  const notes = renderNotes(
    [note, { type: 'fixed', scope: 'Image', text: 'Fix sizing.\n\nKeep explicit bounds.' }],
    config,
  )
  assert.ok(notes.includes('### Added\n\n- **Dialog** Add a title slot.'))
  assert.ok(notes.includes('### Fixed\n\n- **Image** Fix sizing.\n\n  Keep explicit bounds.'))
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
  assert.match(output, /@hina-ui\/vue: 1\.7\.0 -> 1\.7\.1/)
  assert.match(output, /@hina-ui\/react: 1\.7\.0 -> 1\.7\.1/)
  assert.equal(f.git(['status', '--porcelain']), '')
  const plan = planRelease()
  applyRelease(plan)
  assert.equal(versionOf(vue.package), '1.7.1')
  assert.equal(versionOf(react.package), '1.7.1')
  assert.ok(readFileSync(vue.changelog, 'utf8').includes('Existing history.'))
  assert.equal(releaseNotes(readFileSync(vue.changelog, 'utf8'), '1.7.1'), plan.packages[0].notes)
  assert.equal(releaseNotes(readFileSync(react.changelog, 'utf8'), '1.7.1'), plan.packages[1].notes)
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

test('only the version-changing commit of a merged release PR becomes a release candidate', t => {
  const f = fixture(t)
  f.write('.changes/dialog.md', record())
  f.commit('add capability')
  assert.equal(releaseCandidates(), null)
  f.git(['checkout', '-b', 'release/next'])
  applyRelease(planRelease())
  f.commit('prepare release')
  assert.equal(releaseCandidates(config, { github: () => [] }), null)
  f.git(['checkout', 'main'])
  f.write('other.txt', 'another change')
  f.commit('other work')
  f.git(['merge', '--no-ff', 'release/next', '-m', 'Merge release'])
  const merged = f.git(['rev-parse', 'HEAD'])
  const io = { github: () => [releasePull(merged)] }
  const release = releaseCandidates(config, io)
  assert.equal(release.sha, merged)
  assert.deepEqual(
    release.packages.map(item => [item.tag, item.sha, item.manifest]),
    [
      ['@hina-ui/vue@1.7.1', merged, vue.package],
      ['@hina-ui/react@1.7.1', merged, react.package],
    ],
  )
  assert.equal(
    release.packages[1].notes,
    releaseNotes(readFileSync(react.changelog, 'utf8'), '1.7.1'),
  )
  f.write('other.txt', 'later change')
  f.commit('later work')
  assert.equal(releaseCandidates(), null)
})

test('syncing main release history into dev cannot publish a version from the wrong parent', t => {
  const f = fixture(t)
  f.write('.changes/dialog.md', record())
  f.commit('add capability')
  f.git(['checkout', '-b', 'dev'])
  f.write('.changes/image.md', record('fixed').replaceAll('Dialog', 'Image'))
  f.commit('unreleased work')
  f.git(['checkout', 'main'])
  applyRelease(planRelease())
  f.commit('release version')
  const released = f.git(['rev-parse', 'HEAD'])
  f.git(['checkout', 'dev'])
  f.git(['merge', '--no-ff', 'main', '-m', 'Sync main release history'])
  assert.equal(JSON.parse(f.git(['show', `HEAD^:${vue.package}`])).version, '1.7.0')
  assert.equal(versionOf(vue.package), '1.7.1')
  assert.equal(releaseCandidates(config, { github: () => [] }), null)
  assert.equal(releaseCandidates(config, { github: () => [releasePull(released)] }), null)
  assert.equal(readChanges(config).length, 1)
})

for (const method of ['squash', 'rebase']) {
  test(`${method} release merges remain publishable when GitHub identifies the exact commit`, t => {
    const f = fixture(t)
    f.write('.changes/dialog.md', record())
    f.commit('add capability')
    f.git(['checkout', '-b', 'release/next'])
    applyRelease(planRelease())
    f.commit('prepare release')
    f.git(['checkout', 'main'])
    f.write('other.txt', 'independent work')
    f.commit('other work')
    if (method === 'squash') {
      f.git(['merge', '--squash', config.branch])
      f.commit('squash release')
    } else {
      f.git(['checkout', config.branch])
      f.git(['rebase', 'main'])
      f.git(['checkout', 'main'])
      f.git(['merge', '--ff-only', config.branch])
    }
    const merged = f.git(['rev-parse', 'HEAD'])
    assert.equal(releaseCandidates(config, { github: () => [releasePull(merged)] }).sha, merged)
  })
}

test('release provenance rejects unrelated, unmerged, foreign and stale pull requests', () => {
  const valid = releasePull()
  assert.equal(isReleaseCommit(candidate, { github: () => [valid] }), true)
  for (const difference of [
    { merged_at: null },
    { merge_commit_sha: 'b'.repeat(40) },
    { base: { ...valid.base, ref: 'dev' } },
    { base: { ...valid.base, repo: { full_name: 'other/ui' } } },
    { head: { ...valid.head, ref: 'dev' } },
    { head: { ...valid.head, repo: { full_name: 'other/ui' } } },
    { head: null },
  ])
    assert.equal(isReleaseCommit(candidate, { github: () => [{ ...valid, ...difference }] }), false)
})

test('publication refuses missing release provenance before any registry or write operations', async () => {
  for (const pulls of [[], [releasePull('b'.repeat(40))]]) {
    const { calls, io } = publication({
      github: () => pulls,
      registry: () => {
        assert.fail('Registry must not be accessed')
      },
    })
    await assert.rejects(
      publishRelease(releaseOf('vue', 'react'), io),
      /not a merged release\/next release PR/,
    )
    assert.deepEqual(calls, [])
  }
  const { calls, io } = publication({
    github: () => {
      throw new Error('GitHub unavailable')
    },
  })
  await assert.rejects(publishRelease(releaseOf('vue', 'react'), io), /GitHub unavailable/)
  assert.deepEqual(calls, [])
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

test('pnpm change:add invokes the repository CLI instead of a package-manager built-in', () => {
  const help = execFileSync('pnpm', ['change:add', '--help'], {
    cwd: fileURLToPath(new URL('../../', import.meta.url)),
    encoding: 'utf8',
  })
  assert.ok(help.includes('Example: pnpm change:add added Dialog'))
  assert.ok(help.includes('[--package <vue|react>]'))
  assert.ok(help.includes('--package vue'))
  assert.ok(help.includes(`The default version bump is ${config.defaultBump}.`))
})

test('change CLI help lists configured types without changing files', t => {
  const f = fixture(t)
  const types = config.sections.map(section => section.type).join('|')
  for (const flag of ['--help', '-h']) {
    const result = spawnSync(process.execPath, [join(scripts, 'change.mjs'), flag], {
      encoding: 'utf8',
    })
    assert.equal(result.status, 0)
    assert.ok(result.stdout.includes(types))
    assert.ok(result.stdout.includes('pnpm change:add added Dialog'))
    assert.equal(result.stderr, '')
  }
  assert.equal(f.git(['status', '--porcelain']), '')
})

test('change CLI rejects invalid arguments with usage and never creates a record', t => {
  const f = fixture(t)
  for (const args of [
    [],
    ['feat', 'Affix', 'Add sticky positioning.'],
    ['fixed', '  ', 'Fix sizing.'],
    ['fixed', 'Image', '  '],
    ['fixed', 'Image', 'Fix sizing.', 'tiny'],
    ['fixed', 'Image', 'Fix sizing.', 'patch', 'extra'],
    ['fixed', 'Image', 'Fix sizing.', '--package', 'angular'],
    ['fixed', 'Image', 'Fix sizing.', '--package'],
    ['fixed', 'Image', 'Fix sizing.', '--package=vue,'],
    ['fixed', 'Image', 'Fix sizing.', '--packages', 'vue'],
  ]) {
    const result = spawnSync(process.execPath, [join(scripts, 'change.mjs'), ...args], {
      encoding: 'utf8',
    })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /Usage: pnpm change:add <added\|changed/)
    assert.equal(result.stdout, '')
    assert.equal(f.git(['status', '--porcelain']), '')
  }
})

test('change CLI restricts records with repeated or comma-separated --package flags', t => {
  fixture(t)
  const add = (scope, ...flags) => {
    const file = execFileSync(
      process.execPath,
      [join(scripts, 'change.mjs'), 'fixed', scope, 'Fix sizing.', ...flags],
      { encoding: 'utf8' },
    ).trim()
    return {
      raw: readFileSync(file, 'utf8'),
      parsed: parseChange(readFileSync(file, 'utf8'), file, config),
    }
  }
  const one = add('Vue', '--package', 'vue')
  assert.match(one.raw, /^packages: vue$/m)
  assert.deepEqual(one.parsed.packages, ['vue'])
  const repeated = add('Both', '--package', 'react', '--package', 'vue', 'minor')
  assert.match(repeated.raw, /^packages: \[vue, react\]$/m)
  assert.equal(repeated.parsed.level, 'minor')
  assert.deepEqual(add('Comma', '--package=react,vue').parsed.packages, ['vue', 'react'])
  assert.deepEqual(add('Spaced', '--package', 'react, react').parsed.packages, ['react'])
  assert.equal(add('All').parsed.packages, undefined)
  assert.equal(readChanges(config).length, 5)
})

test('change CLI creates every configured category and preserves explicit release levels', t => {
  fixture(t)
  for (const { type } of config.sections) {
    execFileSync(process.execPath, [
      join(scripts, 'change.mjs'),
      type,
      ' Dialog ',
      ' Update the API.\n\nUse the new slot. ',
      'major',
    ])
  }
  const records = readChanges(config)
  assert.deepEqual(
    records.map(record => record.type).sort(),
    config.sections.map(section => section.type).sort(),
  )
  for (const record of records) {
    assert.equal(record.scope, 'Dialog')
    assert.equal(record.level, 'major')
    assert.equal(record.text, 'Update the API.\n\nUse the new slot.')
  }
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
  await publishRelease(single, io)
  assert.deepEqual(calls, ['npm:vue', 'tag:vue', 'release:vue:latest'])
  calls.length = 0
  await publishRelease(single, io)
  assert.deepEqual(calls, [])
})

test('failure after npm publication is retryable without publishing npm again', async () => {
  const { calls, io } = publication()
  const create = io.createRelease
  io.createRelease = async () => {
    throw new Error('GitHub unavailable')
  }
  await assert.rejects(publishRelease(single, io), /GitHub unavailable/)
  assert.deepEqual(calls, ['npm:vue', 'tag:vue'])
  calls.length = 0
  io.createRelease = create
  await publishRelease(single, io)
  assert.deepEqual(calls, ['tag:vue', 'release:vue:latest'])
})

test('registry, CI and tag failures stop publishing without swallowing errors', async () => {
  for (const override of [
    {
      registry: async () => {
        throw new Error('Registry unavailable')
      },
    },
    { tagCommit: () => 'other' },
    {
      github: path =>
        path.includes('/commits/')
          ? [releasePull()]
          : { workflow_runs: [{ ...passing, conclusion: 'failure' }] },
    },
  ]) {
    const { calls, io } = publication(override)
    await assert.rejects(checkRelease(releaseOf('vue', 'react'), io))
    await assert.rejects(publishRelease(releaseOf('vue', 'react'), io))
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
  const versions = () =>
    config.packages.map(
      entry =>
        JSON.parse(f.git(['show', `refs/remotes/origin/${config.branch}:${entry.package}`]))
          .version,
    )
  const version = () => {
    const [first, ...rest] = versions()
    assert.ok(rest.every(value => value === first))
    return first
  }
  assert.throws(() => invoke({ BUMP: 'minor', GH_FAKE_FAIL_CI: 'true' }))
  assert.equal(version(), '1.8.0')
  assert.ok(
    f
      .git(['show', `refs/remotes/origin/${config.branch}:${react.changelog}`])
      .startsWith('# @hina-ui/react\n\n## [1.8.0]'),
  )
  f.git(['checkout', 'main'])
  assert.match(
    invoke(),
    /Unchanged release PR: chore\(release\): @hina-ui\/vue@1\.8\.0, @hina-ui\/react@1\.8\.0/,
  )
  assert.equal(version(), '1.8.0')
  assert.equal(JSON.parse(readFileSync(stateFile)).dispatches, 1)
  f.git(['reset', '--hard', 'HEAD'])
  f.git(['clean', '-fd', '--', 'packages'])
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
  f.git(['reset', '--hard', 'HEAD'])
  f.git(['clean', '-fd', '--', 'packages'])
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
  await publishRelease(single, io)
  assert.equal(latest, false)
  assert.deepEqual(calls, ['tag:vue'])
})

test('annotated release tags use the bot identity in a checkout without git identity', t => {
  const f = fixture(t)
  const remote = join(f.root, '.git', 'remote.git')
  f.git(['init', '--bare', remote])
  f.git(['remote', 'add', 'origin', remote])
  const target = { ...candidate, sha: f.git(['rev-parse', 'HEAD']) }
  f.git(['config', '--unset', 'user.name'])
  f.git(['config', '--unset', 'user.email'])
  f.git(['config', 'user.useConfigOnly', 'true'])
  f.write('.git/empty-global-config', '')
  const env = {
    ...process.env,
    GIT_CONFIG_GLOBAL: join(f.root, '.git', 'empty-global-config'),
    GIT_CONFIG_NOSYSTEM: '1',
  }
  for (const key of [
    'GIT_AUTHOR_NAME',
    'GIT_AUTHOR_EMAIL',
    'GIT_COMMITTER_NAME',
    'GIT_COMMITTER_EMAIL',
  ])
    delete env[key]
  assert.throws(() =>
    execFileSync('git', ['tag', '--no-sign', '-a', target.tag, target.sha, '-m', target.tag], {
      env,
      stdio: 'pipe',
    }),
  )
  const invoke = () =>
    execFileSync(
      process.execPath,
      [
        '--input-type=module',
        '-e',
        `import { pushReleaseTag } from ${JSON.stringify(new URL('./publish.mjs', import.meta.url).href)}; pushReleaseTag(${JSON.stringify(target)})`,
      ],
      { env, stdio: 'pipe' },
    )
  invoke()
  const tag = f.git(['rev-parse', target.tag])
  assert.equal(f.git(['cat-file', '-t', tag]), 'tag')
  assert.equal(f.git(['rev-parse', `${target.tag}^{commit}`]), target.sha)
  assert.equal(
    f.git(['for-each-ref', '--format=%(taggername) %(taggeremail)', `refs/tags/${target.tag}`]),
    'github-actions[bot] <github-actions[bot]@users.noreply.github.com>',
  )
  assert.match(f.git(['ls-remote', 'origin', `refs/tags/${target.tag}`]), new RegExp(`^${tag}\\s`))
  assert.throws(() => f.git(['config', '--local', '--get', 'user.name']))
  invoke()
  assert.equal(f.git(['rev-parse', target.tag]), tag)
})

test('a tag failure after npm publication retries only the tag and GitHub release', async () => {
  const { calls, io } = publication()
  const push = io.pushTag
  io.pushTag = async () => {
    throw new Error('Tag creation failed')
  }
  await assert.rejects(publishRelease(single, io), /Tag creation failed/)
  assert.deepEqual(calls, ['npm:vue'])
  calls.length = 0
  io.pushTag = push
  await publishRelease(single, io)
  assert.deepEqual(calls, ['tag:vue', 'release:vue:latest'])
})

test('lockstep preparation bumps every package and gives each changelog only its records', t => {
  const f = fixture(t, { description: 'React', sideEffects: ['**/*.css'] })
  f.git(['tag', '@hina-ui/vue@1.7.0'])
  f.write('.changes/a-shared.md', record().replace('Dialog', 'Shared'))
  f.write('.changes/b-vue.md', record('fixed', undefined, 'vue').replace('Dialog', 'VueOnly'))
  f.write('.changes/c-react.md', record('added', undefined, 'react').replace('Dialog', 'ReactOnly'))
  f.write(
    '.changes/d-both.md',
    record('changed', undefined, '[vue, react]').replace('Dialog', 'Both'),
  )
  f.commit('records')
  const plan = planRelease()
  assert.equal(plan.current, '1.7.0')
  assert.equal(plan.version, '1.7.1')
  assert.equal(plan.title, 'chore(release): @hina-ui/vue@1.7.1, @hina-ui/react@1.7.1')
  assert.deepEqual(
    plan.packages.map(entry => [entry.id, entry.tag, entry.first]),
    [
      ['vue', '@hina-ui/vue@1.7.1', false],
      ['react', '@hina-ui/react@1.7.1', true],
    ],
  )
  applyRelease(plan)
  assert.deepEqual(JSON.parse(readFileSync(react.package, 'utf8')), {
    name: '@hina-ui/react',
    version: '1.7.1',
    description: 'React',
    sideEffects: ['**/*.css'],
  })
  const vueLog = readFileSync(vue.changelog, 'utf8')
  const reactLog = readFileSync(react.changelog, 'utf8')
  const vueNotes = releaseNotes(vueLog, '1.7.1')
  const reactNotes = releaseNotes(reactLog, '1.7.1')
  for (const scope of ['Shared', 'VueOnly', 'Both']) assert.ok(vueNotes.includes(`**${scope}**`))
  assert.ok(!vueNotes.includes('ReactOnly'))
  for (const scope of ['Shared', 'ReactOnly', 'Both'])
    assert.ok(reactNotes.includes(`**${scope}**`))
  assert.ok(!reactNotes.includes('VueOnly'))
  assert.ok(
    vueLog.startsWith(
      `# @hina-ui/vue\n\n## [1.7.1](${compare('@hina-ui/vue@1.7.0', '@hina-ui/vue@1.7.1')}) (`,
    ),
  )
  assert.ok(vueLog.endsWith('- Existing history.\n'))
  assert.ok(
    reactLog.startsWith(`# @hina-ui/react\n\n## [1.7.1](${tree('@hina-ui/react@1.7.1')}) (`),
  )
  assert.ok(reactLog.endsWith('\n') && !reactLog.endsWith('\n\n'))
  assert.equal(readChanges(config).length, 0)
  assert.equal(planRelease(), null)
})

test('a package without records still gets the version and a lockstep changelog entry', t => {
  const f = fixture(t)
  f.write('.changes/dialog.md', record('fixed', undefined, 'vue'))
  f.commit('vue record')
  const output = execFileSync(process.execPath, [join(scripts, 'prepare.mjs'), '--dry'], {
    encoding: 'utf8',
  })
  assert.ok(output.includes(`## @hina-ui/react\n\n${lockstepNote}\n`))
  assert.match(output, /@hina-ui\/react: 1\.7\.0 -> 1\.7\.1 \(first release\)/)
  const plan = planRelease()
  assert.equal(plan.packages[1].notes, `${lockstepNote}\n`)
  assert.deepEqual(plan.packages[1].changes, [])
  applyRelease(plan)
  assert.equal(versionOf(react.package), '1.7.1')
  assert.equal(releaseNotes(readFileSync(react.changelog, 'utf8'), '1.7.1'), `${lockstepNote}\n`)
  assert.ok(releaseNotes(readFileSync(vue.changelog, 'utf8'), '1.7.1').includes('**Dialog**'))
  assert.ok(!readFileSync(vue.changelog, 'utf8').includes(lockstepNote))
})

test('planning rejects mismatched versions and private packages without writing', t => {
  for (const [reactManifest, pattern] of [
    [
      { version: '1.6.0' },
      /Packages must share one version: @hina-ui\/vue 1\.7\.0, @hina-ui\/react 1\.6\.0/,
    ],
    [{ private: true }, /@hina-ui\/react is private or unnamed in packages\/react\/package\.json/],
    [{ private: true, version: '0.0.0' }, /private or unnamed[\s\S]*share one version/],
  ]) {
    const f = fixture(t, reactManifest)
    f.write('.changes/dialog.md', record('fixed', undefined, 'vue'))
    f.commit('record')
    assert.throws(() => planRelease(), pattern)
    const preview = spawnSync(process.execPath, [join(scripts, 'prepare.mjs'), '--dry'], {
      encoding: 'utf8',
    })
    assert.equal(preview.status, 1)
    assert.match(preview.stderr, /^Cannot plan a lockstep release:\n- /)
    assert.match(preview.stderr, pattern)
    assert.doesNotMatch(preview.stderr, /\n\s+at /)
    const prepare = spawnSync(process.execPath, [join(scripts, 'prepare.mjs')], {
      encoding: 'utf8',
    })
    assert.equal(prepare.status, 1)
    assert.equal(f.git(['status', '--porcelain']), '')
  }
})

test('existing tags for any package in the release block planning', t => {
  const f = fixture(t)
  f.write('.changes/dialog.md', record('fixed', undefined, 'vue'))
  f.git(['tag', '@hina-ui/react@1.7.1'])
  assert.throws(() => planRelease(), /Tag already exists: @hina-ui\/react@1.7.1/)
})

function releaseBranch(f, manifests) {
  f.git(['checkout', '-b', config.branch])
  for (const [entry, name, version, extra] of manifests) {
    f.write(entry.package, manifest(name, version, extra))
    f.write(
      entry.changelog,
      `# ${name}\n\n## [${version}](${tree(`${name}@${version}`)}) (2026-10-04)\n\n${lockstepNote}\n`,
    )
  }
  f.commit('prepare release')
  f.git(['checkout', 'main'])
  f.git(['merge', '--no-ff', config.branch, '-m', 'Merge release'])
  const merged = f.git(['rev-parse', 'HEAD'])
  return { merged, io: { github: () => [releasePull(merged)] } }
}

test('a private package becomes publishable when the release makes it public', t => {
  const f = fixture(t, { private: true, version: '0.0.0' })
  const { merged, io } = releaseBranch(f, [
    [vue, '@hina-ui/vue', '1.7.1'],
    [react, '@hina-ui/react', '1.7.1'],
  ])
  const release = releaseCandidates(config, io)
  assert.equal(release.sha, merged)
  assert.deepEqual(
    release.packages.map(item => [item.id, item.tag, item.first]),
    [
      ['vue', '@hina-ui/vue@1.7.1', false],
      ['react', '@hina-ui/react@1.7.1', true],
    ],
  )
  assert.equal(release.packages[1].notes, `${lockstepNote}\n`)
  assert.equal(releaseCandidates(config, { github: () => [] }), null)
})

test('first releases keep the name, visibility and version checks', t => {
  const unreleased = { private: true, version: '0.0.1' }
  for (const { from, to, error, ids } of [
    { from: unreleased, to: ['@hina-ui/react-dom', '1.7.1'], error: /named @hina-ui\/react/ },
    { from: unreleased, to: ['@hina-ui/react', '0.0.0'], error: /increase its version/ },
    { from: {}, to: ['@hina-ui/react', '1.7.1', { private: true }], error: /public/ },
    { from: unreleased, to: ['@hina-ui/react', '0.0.2', { private: true }], ids: ['vue'] },
  ]) {
    const f = fixture(t, from)
    const { io } = releaseBranch(f, [
      [vue, '@hina-ui/vue', '1.7.1'],
      [react, ...to],
    ])
    if (error) assert.throws(() => releaseCandidates(config, io), error)
    else
      assert.deepEqual(
        releaseCandidates(config, io).packages.map(item => item.id),
        ids,
      )
  }
})

test('merging a branch that introduces a package does not make it a release candidate', t => {
  const f = fixture(t)
  f.git(['rm', '-r', '-q', 'packages/react'])
  f.commit('main without react')
  f.git(['checkout', '-b', 'feat/react'])
  f.write(react.package, manifest('@hina-ui/react', '1.7.0'))
  f.commit('add react')
  f.git(['checkout', 'main'])
  f.git(['merge', '--no-ff', 'feat/react', '-m', 'Merge react'])
  const merged = f.git(['rev-parse', 'HEAD'])
  assert.equal(releaseCandidates(config, { github: () => [releasePull(merged)] }), null)
  assert.equal(releaseCandidates(config, { github: () => [] }), null)
})

test('several packages publish to npm first, then get their own tag and GitHub release', async () => {
  const notes = []
  const { calls, io, npm, tags, releases } = publication()
  const create = io.createRelease
  io.createRelease = async (item, latest) => {
    notes.push([item.tag, item.notes])
    await create(item, latest)
  }
  const release = releaseOf('vue', 'react')
  release.packages[1].notes = `${lockstepNote}\n`
  await publishRelease(release, io)
  assert.deepEqual(calls, [
    'npm:vue',
    'npm:react',
    'tag:vue',
    'release:vue:latest',
    'tag:react',
    'release:react',
  ])
  assert.deepEqual(
    [...npm],
    [
      ['@hina-ui/vue', '1.7.1'],
      ['@hina-ui/react', '1.7.1'],
    ],
  )
  assert.deepEqual([...tags], ['@hina-ui/vue@1.7.1', '@hina-ui/react@1.7.1'])
  assert.deepEqual([...releases], ['@hina-ui/vue@1.7.1', '@hina-ui/react@1.7.1'])
  assert.deepEqual(notes, [
    ['@hina-ui/vue@1.7.1', candidate.notes],
    ['@hina-ui/react@1.7.1', `${lockstepNote}\n`],
  ])
  calls.length = 0
  await publishRelease(release, io)
  assert.deepEqual(calls, [])
})

test('a rerun after a partial multi-package release publishes only what is missing', async () => {
  const { calls, io } = publication()
  const publish = io.publish
  io.publish = async item => {
    if (item.id === 'react') throw new Error('npm unavailable')
    await publish(item)
  }
  const release = releaseOf('vue', 'react')
  await assert.rejects(publishRelease(release, io), /npm unavailable/)
  assert.deepEqual(calls, ['npm:vue'])
  calls.length = 0
  io.publish = publish
  await publishRelease(release, io)
  assert.deepEqual(calls, [
    'npm:react',
    'tag:vue',
    'release:vue:latest',
    'tag:react',
    'release:react',
  ])

  const done = publication()
  await publishRelease(releaseOf('vue'), done.io)
  done.calls.length = 0
  await publishRelease(release, done.io)
  assert.deepEqual(done.calls, ['npm:react', 'tag:react', 'release:react'])
})

test('a conflict on any package stops the whole release before any write', async () => {
  for (const override of [
    {
      registry: async name =>
        name === '@hina-ui/react' ? { versions: { '1.7.1': { gitHead: 'b'.repeat(40) } } } : {},
    },
    {
      registry: async name =>
        name === '@hina-ui/react' ? { 'dist-tags': { latest: '1.8.0' } } : {},
    },
    { tagCommit: tag => (tag === '@hina-ui/react@1.7.1' ? 'b'.repeat(40) : null) },
    {
      github: path => {
        if (path.includes('/commits/')) return [releasePull()]
        if (path.includes('/actions/')) return { workflow_runs: [passing] }
        return path.includes('react') ? { id: 1 } : null
      },
    },
  ]) {
    const { calls, io } = publication(override)
    await assert.rejects(publishRelease(releaseOf('vue', 'react'), io))
    assert.deepEqual(calls, [])
  }
})

test('the release check reports whether to publish and which packages to build', async () => {
  assert.equal(checkOutput([]), 'candidate=false\npublish=false\npackages=\n')
  const { io } = publication()
  const release = releaseOf('vue', 'react')
  assert.equal(
    checkOutput(await checkRelease(release, io)),
    'candidate=true\npublish=true\npackages=@hina-ui/vue @hina-ui/react\n',
  )
  await io.publish(release.packages[0])
  assert.equal(
    checkOutput(await checkRelease(release, io)),
    'candidate=true\npublish=true\npackages=@hina-ui/react\n',
  )
  await io.publish(release.packages[1])
  await io.pushTag(release.packages[0])
  await io.createRelease(release.packages[0], true)
  assert.equal(
    checkOutput(await checkRelease(release, io)),
    'candidate=true\npublish=false\npackages=\n',
  )
  await io.pushTag(release.packages[1])
  await io.createRelease(release.packages[1], false)
  assert.equal(
    checkOutput(await checkRelease(release, io)),
    'candidate=false\npublish=false\npackages=\n',
  )
})
