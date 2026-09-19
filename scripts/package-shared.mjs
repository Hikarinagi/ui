import { cpSync, mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const shared = fileURLToPath(new URL('../packages/shared/src/', import.meta.url))
const target = fileURLToPath(new URL('../packages/vue/dist/shared/', import.meta.url))
const styles = fileURLToPath(new URL('../packages/vue/dist/styles/', import.meta.url))

cpSync(shared, target, { recursive: true })
mkdirSync(styles, { recursive: true })
cpSync(
  fileURLToPath(new URL('../patches/overlayscrollbars.LICENSE', import.meta.url)),
  fileURLToPath(new URL('../packages/vue/dist/overlayscrollbars.LICENSE', import.meta.url)),
)
writeFileSync(
  `${styles}tokens.css`,
  "@import '../shared/styles/tokens.css';\n\n@source '../../src/components/**/*.vue';\n",
)
