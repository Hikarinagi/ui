import { h } from 'vue'
import VCodeBlock from '@hina-ui/vue/components/code-block/CodeBlock.vue'
import VProse from '@hina-ui/vue/components/prose/Prose.vue'
import { CodeBlock } from '@hina-ui/react/components/code-block/CodeBlock'
import { Prose } from '@hina-ui/react/components/prose/Prose'
import { defineCases } from '../src/cases'

const source = `import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')`
const long = Array.from(
  { length: 16 },
  (_, index) => 'const value' + (index + 1) + " = { name: 'Hina UI', enabled: true }",
).join('\n')
const sample = `const a = 1\n\n  indented('保留空白')\n`
const html = `<span style="color:#8250df">const</span><span> accent = </span><span style="color:#0a3069">'#39c5bb'</span>`

export default defineCases('CodeBlock', [
  {
    name: 'plain text without a language keeps whitespace',
    vue: () => h(VCodeBlock, { code: sample }),
    react: () => <CodeBlock code={sample} />,
  },
  {
    name: 'language tag and copy button before highlighting',
    vue: () =>
      h(VCodeBlock, { code: 'pnpm add @hina-ui/vue', lang: 'bash', class: 'w-full max-w-xl' }),
    react: () => <CodeBlock code="pnpm add @hina-ui/vue" lang="bash" className="w-full max-w-xl" />,
  },
  {
    name: 'multi-line source with a language',
    vue: () => h(VCodeBlock, { code: source, lang: 'ts' }),
    react: () => <CodeBlock code={source} lang="ts" />,
  },
  {
    name: 'label replaces the language tag',
    vue: () => h(VCodeBlock, { code: source, lang: 'ts', label: 'nuxt.config.ts' }),
    react: () => <CodeBlock code={source} lang="ts" label="nuxt.config.ts" />,
  },
  {
    name: 'label without a language',
    vue: () => h(VCodeBlock, { code: 'x', label: '配置' }),
    react: () => <CodeBlock code="x" label="配置" />,
  },
  {
    name: 'not copyable',
    vue: () =>
      h(VCodeBlock, { code: 'git switch -c feature/hina-ui', lang: 'bash', copyable: false }),
    react: () => <CodeBlock code="git switch -c feature/hina-ui" lang="bash" copyable={false} />,
  },
  {
    name: 'prerendered html',
    vue: () => h(VCodeBlock, { code: `const accent = '#39c5bb'`, html, lang: 'ts' }),
    react: () => <CodeBlock code={`const accent = '#39c5bb'`} html={html} lang="ts" />,
  },
  ...['h-48 w-full max-w-lg', 'max-h-48 w-full max-w-lg'].map(className => ({
    name: `size class ${className}`,
    vue: () => h(VCodeBlock, { code: long, lang: 'ts', class: className }),
    react: () => <CodeBlock code={long} lang="ts" className={className} />,
  })),
  {
    name: 'style, id and data attributes on the root',
    vue: () =>
      h(VCodeBlock, {
        code: 'x',
        style: 'width:288px;height:160px',
        id: 'snippet',
        'data-testid': 'block',
      }),
    react: () => (
      <CodeBlock
        code="x"
        style={{ width: '288px', height: '160px' }}
        id="snippet"
        data-testid="block"
      />
    ),
  },
  {
    name: 'inside prose',
    vue: () => h(VProse, null, () => h(VCodeBlock, { code: long, class: 'h-40' })),
    react: () => (
      <Prose>
        <CodeBlock code={long} className="h-40" />
      </Prose>
    ),
  },
])
