import { readFileSync, realpathSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { describe, expect, it } from 'vitest'

const packages = join(process.cwd(), '..')

function version(from: string, name: string) {
  const require = createRequire(join(packages, from, 'package.json'))
  let directory = dirname(require.resolve(name))
  while (!directory.endsWith(join('node_modules', ...name.split('/'))))
    directory = dirname(directory)
  return JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8')).version as string
}

function packageRoot(from: string, name: string) {
  const require = createRequire(join(from, 'package.json'))
  let directory = dirname(require.resolve(name))
  while (!directory.endsWith(join('node_modules', ...name.split('/'))))
    directory = dirname(directory)
  return directory
}

function manifest(directory: string) {
  return JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8')) as { version: string }
}

describe('engines shared by both adapters resolve to the same versions', () => {
  it('built-in icons come from the same lucide release', () => {
    expect(version('react', 'lucide-react')).toBe(version('vue', '@lucide/vue'))
  })

  it('motion-v and motion run the same framer-motion and motion-dom', () => {
    const vue = realpathSync(join(packages, 'vue', 'node_modules', 'motion-v'))
    const react = realpathSync(join(packages, 'react', 'node_modules', 'motion'))
    const engine = (from: string) => {
      const framer = realpathSync(packageRoot(from, 'framer-motion'))
      return [manifest(framer).version, manifest(packageRoot(framer, 'motion-dom')).version]
    }
    expect(engine(react)).toEqual(engine(vue))
  })

  it('tables and virtual lists share the TanStack cores', () => {
    const core = (adapter: string, wrapper: string, name: string) =>
      manifest(packageRoot(realpathSync(join(packages, adapter, 'node_modules', wrapper)), name))
        .version
    expect(core('react', '@tanstack/react-table', '@tanstack/table-core')).toBe(
      core('vue', '@tanstack/vue-table', '@tanstack/table-core'),
    )
    expect(core('react', '@tanstack/react-virtual', '@tanstack/virtual-core')).toBe(
      core('vue', '@tanstack/vue-virtual', '@tanstack/virtual-core'),
    )
  })

  it('floating content is positioned by the same Floating UI release', () => {
    const dom = (adapter: string, ...path: string[]) => {
      let directory = realpathSync(join(packages, adapter, 'node_modules', path[0]))
      for (const name of path.slice(1)) directory = realpathSync(packageRoot(directory, name))
      return manifest(realpathSync(packageRoot(directory, '@floating-ui/dom'))).version
    }
    expect(dom('react', '@floating-ui/react-dom')).toBe(dom('vue', 'reka-ui', '@floating-ui/vue'))
  })

  it('carousel and code highlighting use the same releases', () => {
    const own = (adapter: string, name: string) =>
      manifest(realpathSync(join(packages, adapter, 'node_modules', name))).version
    expect(own('react', 'embla-carousel')).toBe(own('vue', 'embla-carousel'))
    expect(own('react', 'shiki')).toBe(own('vue', 'shiki'))
  })
})
