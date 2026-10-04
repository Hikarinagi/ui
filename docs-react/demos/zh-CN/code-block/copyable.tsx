import { CodeBlock } from '@hina-ui/react'

export default function Demo() {
  return (
    <CodeBlock
      code="git switch -c feature/hina-ui"
      lang="bash"
      copyable={false}
      className="w-full max-w-xl"
    />
  )
}
