import { CodeBlock } from '@hina-ui/react'

const source = Array.from(
  { length: 16 },
  (_, index) => 'const value' + (index + 1) + " = { name: 'Hina UI', enabled: true }",
).join('\n')

export default function Demo() {
  return <CodeBlock code={source} lang="ts" className="h-48 w-full max-w-lg" />
}
