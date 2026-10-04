import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

export default function setup() {
  execFileSync(
    process.execPath,
    [fileURLToPath(new URL('../../../docs/react/scripts/generate.mjs', import.meta.url))],
    { stdio: 'ignore' },
  )
}
