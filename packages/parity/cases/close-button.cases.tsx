import { h } from 'vue'
import VCloseButton from '@hina-ui/vue/components/close-button/CloseButton.vue'
import VTooltipProvider from '@hina-ui/vue/components/tooltip/TooltipProvider.vue'
import { CloseButton } from '@hina-ui/react/components/close-button/CloseButton'
import { TooltipProvider } from '@hina-ui/react/components/tooltip/TooltipProvider'
import { defineCases } from '../src/cases'

export default defineCases('CloseButton', [
  {
    name: 'default locale label, ghost neutral sm pill',
    vue: () => h(VCloseButton),
    react: () => <CloseButton />,
  },
  {
    name: 'disabled with a custom label',
    vue: () => h(VCloseButton, { disabled: true, label: '收起面板' }),
    react: () => <CloseButton disabled label="收起面板" />,
  },
  ...(['xs', 'sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(VCloseButton, { size }),
    react: () => <CloseButton size={size} />,
  })),
  {
    name: 'class merges after the xs size classes',
    vue: () => h(VCloseButton, { size: 'xs', class: 'size-6 -me-1' }),
    react: () => <CloseButton size="xs" className="size-6 -me-1" />,
  },
  {
    name: 'attributes fall through to the button',
    vue: () => h(VCloseButton, { 'data-test': 'close', title: '关闭面板' }),
    react: () => <CloseButton data-test="close" title="关闭面板" />,
  },
  {
    name: 'tooltip without a provider renders only the button',
    vue: () => h(VCloseButton, { tooltip: true }),
    react: () => <CloseButton tooltip />,
  },
  {
    name: 'tooltip inside a provider with a custom side',
    vue: () =>
      h(VTooltipProvider, null, () =>
        h('div', [
          h(VCloseButton, { tooltip: true }),
          h(VCloseButton, { label: '关闭预览', tooltip: true, side: 'right' }),
        ]),
      ),
    react: () => (
      <TooltipProvider>
        <div>
          <CloseButton tooltip />
          <CloseButton label="关闭预览" tooltip side="right" />
        </div>
      </TooltipProvider>
    ),
  },
])
