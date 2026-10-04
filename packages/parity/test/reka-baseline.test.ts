import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join } from 'node:path'
import { describe, expect, it } from 'vitest'

const packages = join(process.cwd(), '..')
const baseline = JSON.parse(
  readFileSync(join(packages, 'react', 'src', 'primitives', 'reka.json'), 'utf8'),
) as { version: string }

function resolvedReka() {
  const require = createRequire(join(packages, 'vue', 'package.json'))
  let directory = dirname(require.resolve('reka-ui'))
  while (!directory.endsWith(join('node_modules', 'reka-ui'))) directory = dirname(directory)
  return (JSON.parse(readFileSync(join(directory, 'package.json'), 'utf8')) as { version: string })
    .version
}

describe('React primitives track the Reka release Vue resolves', () => {
  it('the ported primitives were ported from the resolved reka-ui version', () => {
    expect(
      resolvedReka(),
      `reka-ui changed; diff reka-ui@${baseline.version}/src against the installed src, re-port the changed primitives under packages/react/src/primitives, then update primitives/reka.json`,
    ).toBe(baseline.version)
  })
})
