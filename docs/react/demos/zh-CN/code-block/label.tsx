import { CodeBlock } from '@hina-ui/react'

const source = `export default defineNuxtConfig({
  css: ['@hina-ui/react/styles/tokens.css'],
})`

export default function Demo() {
  return <CodeBlock code={source} lang="ts" label="nuxt.config.ts" className="w-full max-w-xl" />
}
