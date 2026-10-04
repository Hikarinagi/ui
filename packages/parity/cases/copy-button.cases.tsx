import { h } from 'vue'
import VCopyButton from '@hina-ui/vue/components/copy-button/CopyButton.vue'
import VTooltipProvider from '@hina-ui/vue/components/tooltip/TooltipProvider.vue'
import VCode from '@hina-ui/vue/components/code/Code.vue'
import VText from '@hina-ui/vue/components/text/Text.vue'
import { CopyButton } from '@hina-ui/react/components/copy-button/CopyButton'
import { TooltipProvider } from '@hina-ui/react/components/tooltip/TooltipProvider'
import { Code } from '@hina-ui/react/components/code/Code'
import { Text } from '@hina-ui/react/components/text/Text'
import { defineCases } from '../src/cases'

export default defineCases('CopyButton', [
  {
    name: 'default sm ghost neutral with default label',
    vue: () => h(VCopyButton, { text: 'Hina UI' }),
    react: () => <CopyButton text="Hina UI" />,
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(VCopyButton, { text: size, size }),
    react: () => <CopyButton text={size} size={size} />,
  })),
  {
    name: 'custom label with tooltip but no provider',
    vue: () => h(VCopyButton, { text: 'hina-2f9c41', label: '复制订单编号', tooltip: true }),
    react: () => <CopyButton text="hina-2f9c41" label="复制订单编号" tooltip />,
  },
  {
    name: 'custom label with tooltip inside a provider',
    vue: () =>
      h(VTooltipProvider, null, () =>
        h(VCopyButton, {
          text: 'ssh://git@example.com/hina.git',
          label: '复制仓库地址',
          tooltip: true,
        }),
      ),
    react: () => (
      <TooltipProvider>
        <CopyButton text="ssh://git@example.com/hina.git" label="复制仓库地址" tooltip />
      </TooltipProvider>
    ),
  },
  {
    name: 'tooltip disabled by default inside a provider',
    vue: () => h(VTooltipProvider, null, () => h(VCopyButton, { text: 'x' })),
    react: () => (
      <TooltipProvider>
        <CopyButton text="x" />
      </TooltipProvider>
    ),
  },
  {
    name: 'custom timeout',
    vue: () => h(VCopyButton, { text: '五秒后复位', timeout: 5000 }),
    react: () => <CopyButton text="五秒后复位" timeout={5000} />,
  },
  {
    name: 'disabled',
    vue: () => h(VCopyButton, { text: 'x', disabled: true }),
    react: () => <CopyButton text="x" disabled />,
  },
  {
    name: 'class and fallthrough attributes',
    vue: () =>
      h(VCopyButton, {
        text: 'x',
        class: 'ms-2',
        id: 'copy',
        'data-testid': 'copy',
        title: 'Copy',
      }),
    react: () => <CopyButton text="x" className="ms-2" id="copy" data-testid="copy" title="Copy" />,
  },
  {
    name: 'hero demo beside inline code',
    vue: () =>
      h('div', null, [
        h(VCode, null, () => 'pnpm add @hina-ui/vue'),
        h(VCopyButton, { text: 'pnpm add @hina-ui/vue' }),
      ]),
    react: () => (
      <div>
        <Code>pnpm add @hina-ui/vue</Code>
        <CopyButton text="pnpm add @hina-ui/vue" />
      </div>
    ),
  },
  {
    name: 'event demo with a counter label',
    vue: () =>
      h('div', null, [
        h(VCopyButton, { text: 'hina@example.com' }),
        h(VText, { tone: 'muted' }, () => '已复制 0 次'),
      ]),
    react: () => (
      <div>
        <CopyButton text="hina@example.com" />
        <Text tone="muted">已复制 0 次</Text>
      </div>
    ),
  },
])
