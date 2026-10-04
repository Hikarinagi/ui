import { CodeBlock } from '@hina-ui/react'

const output = `✔ dependencies installed
✔ style entry ready
  run pnpm dev to start the dev server`

export default function Demo() {
  return <CodeBlock code={output} className="w-full max-w-xl" />
}
