import assert from 'node:assert/strict'
import { mkdtemp, rm, symlink } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { loadNuxt } from 'nuxt/kit'

const docs = fileURLToPath(new URL('./', import.meta.url))
const require = createRequire(import.meta.url)
const nuxtRequire = createRequire(require.resolve('nuxt/package.json'))
const serverRequire = createRequire(nuxtRequire.resolve('@nuxt/nitro-server/package.json'))
const { rollup } = await import(serverRequire.resolve('rollup'))

test('production import protection collects traces only for invalid imports', async () => {
  const root = await mkdtemp(join(tmpdir(), 'hina-import-protection-'))
  await symlink(join(docs, 'node_modules'), join(root, 'node_modules'), 'junction')
  const nuxt = await loadNuxt({
    cwd: root,
    dev: false,
    overrides: {
      modulesDir: [join(docs, 'node_modules')],
      devtools: { enabled: false },
      telemetry: false,
    },
  })
  try {
    const plugins = (await nuxt._nitro.options.rollupConfig.plugins).flat(Infinity)
    // No eager per-module source-map collector in production.
    assert.equal(
      plugins.some(plugin => plugin?.name === 'impound:trace'),
      false,
    )
    const entry = join(root, 'server/api/example.mjs')
    async function bundle(code: string) {
      return rollup({
        input: entry,
        plugins: [
          ...plugins,
          {
            name: 'fixture',
            resolveId: id => (id === entry ? id : undefined),
            load: id => (id === entry ? code : undefined),
          },
        ],
      })
    }
    const valid = await bundle('export default () => "ok"')
    await valid.close()
    await assert.rejects(
      bundle('import { useNuxtApp } from "#app"; export { useNuxtApp }'),
      error =>
        error instanceof Error &&
        error.message.includes('#app') &&
        error.message.includes('example.mjs'),
    )
  } finally {
    await nuxt.close()
    await rm(root, { recursive: true, force: true })
  }
})
