import { cpSync, mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const adapters = {
  vue: "@source '../../src/components/**/*.vue';\n",
  react:
    "@source '../../src/components/**/*.{ts,tsx}';\n@source '../../src/primitives/**/*.{ts,tsx}';\n@source '../../src/lib/**/*.{ts,tsx}';\n",
}

const adapter = process.argv[2] ?? 'vue'
if (!(adapter in adapters)) throw new Error(`Unknown framework package: ${adapter}`)

const packageRoot = new URL(`../packages/${adapter}/`, import.meta.url)
const shared = fileURLToPath(new URL('../packages/shared/src/', import.meta.url))
const target = fileURLToPath(new URL('dist/shared/', packageRoot))
const styles = fileURLToPath(new URL('dist/styles/', packageRoot))

cpSync(shared, target, { recursive: true })
mkdirSync(styles, { recursive: true })
cpSync(
  fileURLToPath(new URL('../patches/overlayscrollbars.LICENSE', import.meta.url)),
  fileURLToPath(new URL('dist/overlayscrollbars.LICENSE', packageRoot)),
)
writeFileSync(
  `${styles}tokens.css`,
  `@import '../shared/styles/tokens.css';\n\n${adapters[adapter]}`,
)
