import { CodeBlock } from '@hina-ui/react'

const code = `const accent = '#39c5bb'`
const html = `<span style="color:#8250df">const</span><span> accent = </span><span style="color:#0a3069">'#39c5bb'</span>`

export default function Demo() {
  return <CodeBlock code={code} html={html} lang="ts" className="w-full max-w-xl" />
}
