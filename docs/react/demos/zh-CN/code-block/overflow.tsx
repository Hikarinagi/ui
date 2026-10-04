import { CodeBlock } from '@hina-ui/react'

const source = `const theme = { accent: 'var(--hn-accent)', radius: 'var(--hn-radius-lg)', shadow: 'var(--hn-shadow-sm)', font: 'var(--hn-font-sans)' }`

export default function Demo() {
  return <CodeBlock code={source} lang="ts" className="w-full max-w-md" />
}
