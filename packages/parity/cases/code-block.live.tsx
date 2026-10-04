import { h } from 'vue'
import { vi } from 'vitest'
import VCodeBlock from '@hina-ui/vue/components/code-block/CodeBlock.vue'
import { CodeBlock } from '@hina-ui/react/components/code-block/CodeBlock'
import { defineLiveCases, frames } from '../src/live'

const source = `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')`
const long = Array.from(
  { length: 16 },
  (_, index) => 'const value' + (index + 1) + " = { name: 'Hina UI', enabled: true }",
).join('\n')

async function initialized() {
  await vi.waitFor(() => {
    const viewport = document.querySelector('[data-overlayscrollbars-contents]')
    if (!viewport?.hasAttribute('data-overlayscrollbars-viewport'))
      throw new Error('scroll area not initialized')
  })
  await frames(6)
}

async function highlighted() {
  await vi.waitFor(
    () => {
      if (!document.querySelector('code span[style]')) throw new Error('not highlighted')
    },
    { timeout: 5000 },
  )
  await initialized()
}

export default defineLiveCases('CodeBlock', [
  {
    name: 'plain text after the scroll area initializes',
    vue: () => h(VCodeBlock, { code: '✔ 依赖安装完成\n  运行 pnpm dev', class: 'w-full max-w-xl' }),
    react: () => <CodeBlock code={'✔ 依赖安装完成\n  运行 pnpm dev'} className="w-full max-w-xl" />,
    settle: initialized,
  },
  {
    name: 'highlighted tokens after async highlighting',
    vue: () => h(VCodeBlock, { code: source, lang: 'ts', class: 'w-full max-w-xl' }),
    react: () => <CodeBlock code={source} lang="ts" className="w-full max-w-xl" />,
    settle: highlighted,
  },
  {
    name: 'highlighted bash with an alias and label',
    vue: () => h(VCodeBlock, { code: 'pnpm add @hina-ui/vue', lang: 'sh', label: 'Terminal' }),
    react: () => <CodeBlock code="pnpm add @hina-ui/vue" lang="sh" label="Terminal" />,
    settle: highlighted,
  },
  {
    name: 'fixed height with overflow shadows',
    vue: () => h(VCodeBlock, { code: long, lang: 'ts', class: 'h-48 w-full max-w-lg' }),
    react: () => <CodeBlock code={long} lang="ts" className="h-48 w-full max-w-lg" />,
    settle: highlighted,
  },
  {
    name: 'unknown language stays plain',
    vue: () => h(VCodeBlock, { code: '+++', lang: 'brainfuck', copyable: false }),
    react: () => <CodeBlock code="+++" lang="brainfuck" copyable={false} />,
    settle: initialized,
  },
  {
    name: 'prerendered html',
    vue: () =>
      h(VCodeBlock, {
        code: `const accent = 'teal'`,
        html: `<span style="color:var(--hn-accent-text)">const</span><span> accent = 'teal'</span>`,
        lang: 'ts',
      }),
    react: () => (
      <CodeBlock
        code={`const accent = 'teal'`}
        html={`<span style="color:var(--hn-accent-text)">const</span><span> accent = 'teal'</span>`}
        lang="ts"
      />
    ),
    settle: initialized,
  },
])
