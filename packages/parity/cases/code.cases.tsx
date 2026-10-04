import { h } from 'vue'
import VCode from '@hina-ui/vue/components/code/Code.vue'
import { Code } from '@hina-ui/react/components/code/Code'
import { defineCases } from '../src/cases'

export default defineCases('Code', [
  {
    name: 'default',
    vue: () => h(VCode, null, () => '--hn-accent'),
    react: () => <Code>--hn-accent</Code>,
  },
  {
    name: 'class and attributes',
    vue: () => h(VCode, { class: 'text-sm', title: 'token' }, () => 'pnpm dev'),
    react: () => (
      <Code className="text-sm" title="token">
        pnpm dev
      </Code>
    ),
  },
])
