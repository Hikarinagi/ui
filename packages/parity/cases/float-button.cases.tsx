import { h } from 'vue'
import { Plus } from '@hina-ui/vue/../node_modules/@lucide/vue'
import { Plus as ReactPlus } from '@hina-ui/react/../node_modules/lucide-react'
import VFloatButton from '@hina-ui/vue/components/float-button/FloatButton.vue'
import VTooltipProvider from '@hina-ui/vue/components/tooltip/TooltipProvider.vue'
import { FloatButton } from '@hina-ui/react/components/float-button/FloatButton'
import type { FloatButtonProps } from '@hina-ui/react/components/float-button/types'
import { TooltipProvider } from '@hina-ui/react/components/tooltip/TooltipProvider'
import { lucide } from '@hina-ui/react/lib/icon'
import { defineCases } from '../src/cases'

const PlusIcon = lucide(ReactPlus)
type Options = Partial<Omit<FloatButtonProps, 'ref' | 'children'>> & Record<string, unknown>

function vueCase(props: Options) {
  const { className, ...rest } = props
  return () =>
    h(VFloatButton, { label: '新建项目', ...rest, class: className }, { default: () => h(Plus) })
}

function reactCase(props: Options) {
  return () => (
    <FloatButton label="新建项目" {...(props as Partial<FloatButtonProps>)}>
      <PlusIcon />
    </FloatButton>
  )
}

function both(name: string, props: Options) {
  const offset = 'offset' in props || 'style' in props ? {} : { offset: 12 }
  return { name, vue: vueCase({ ...offset, ...props }), react: reactCase({ ...offset, ...props }) }
}

export default defineCases('FloatButton', [
  {
    name: 'without offset or style',
    vue: vueCase({}),
    react: reactCase({}),
  },
  {
    name: 'static without offset or style',
    vue: vueCase({ position: 'static' }),
    react: reactCase({ position: 'static' }),
  },
  both('fixed bottom-end solid accent circle md with an offset', {}),
  both('static position', { position: 'static' }),
  both('absolute placement with numeric offset', {
    position: 'absolute',
    placement: 'top-start',
    offset: 16,
  }),
  both('string offset', { position: 'absolute', placement: 'bottom-start', offset: '2rem' }),
  both('negative offset clamps to zero', { offset: -8 }),
  both('non-finite offset is ignored', { offset: Number.NaN }),
  ...(['sm', 'md', 'lg'] as const).map(size => both(`size ${size}`, { position: 'static', size })),
  both('square soft', { position: 'static', variant: 'soft', shape: 'square' }),
  both('outline neutral', { position: 'static', variant: 'outline', tone: 'neutral' }),
  both('danger tone', { position: 'static', tone: 'danger' }),
  both('extended shows its label and the icon slot', { position: 'static', extended: true }),
  both('loading', { position: 'static', loading: true }),
  both('extended loading', { position: 'static', extended: true, loading: true }),
  both('disabled', { position: 'static', disabled: true }),
  both('without ripple', { position: 'static', ripple: false }),
  both('submit type', { position: 'static', type: 'submit' }),
  both('rendered as a link', { position: 'static', as: 'a', href: '#create' }),
  {
    name: 'typed link attributes',
    vue: () =>
      h(
        VFloatButton,
        {
          label: '新建项目',
          position: 'static',
          as: 'a',
          href: '#create',
          target: '_blank',
          rel: 'noopener',
        },
        { default: () => h(Plus) },
      ),
    react: () => (
      <FloatButton
        label="新建项目"
        position="static"
        as="a"
        href="#create"
        target="_blank"
        rel="noopener"
      >
        <PlusIcon />
      </FloatButton>
    ),
  },
  both('class, style and attributes', {
    position: 'static',
    className: 'shadow-none',
    style: { insetInlineEnd: '24px' },
    id: 'create',
    'data-testid': 'fab',
  }),
  both('tooltip off', { position: 'static', tooltip: false, tooltipSide: 'left' }),
  {
    name: 'hidden renders nothing',
    vue: () => h('div', null, [vueCase({ visible: false })()]),
    react: () => <div>{reactCase({ visible: false })()}</div>,
  },
  {
    name: 'inside a tooltip provider before hydration',
    vue: () => h(VTooltipProvider, null, () => vueCase({ position: 'absolute', offset: 16 })()),
    react: () => (
      <TooltipProvider>{reactCase({ position: 'absolute', offset: 16 })()}</TooltipProvider>
    ),
  },
  {
    name: 'extended inside a tooltip provider',
    vue: () =>
      h(VTooltipProvider, null, () =>
        vueCase({ position: 'absolute', extended: true, label: 'Create <project>', offset: 16 })(),
      ),
    react: () => (
      <TooltipProvider>
        {reactCase({
          position: 'absolute',
          extended: true,
          label: 'Create <project>',
          offset: 16,
        })()}
      </TooltipProvider>
    ),
  },
])
