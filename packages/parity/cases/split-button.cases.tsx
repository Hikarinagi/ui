import { defineComponent, h, type CSSProperties as VueCSSProperties } from 'vue'
import type { CSSProperties } from 'react'
import VSplitButton from '@hina-ui/vue/components/split-button/SplitButton.vue'
import VDropdownMenuItem from '@hina-ui/vue/components/dropdown-menu/DropdownMenuItem.vue'
import { provideUiLocale, enUS as vueEnUS } from '@hina-ui/vue/locale'
import { SplitButton } from '@hina-ui/react/components/split-button/SplitButton'
import type { SplitButtonProps } from '@hina-ui/react/components/split-button/types'
import { DropdownMenuItem } from '@hina-ui/react/components/dropdown-menu/DropdownMenuItem'
import { UiLocaleProvider, enUS } from '@hina-ui/react/locale'
import { defineCases, type ParityCase } from '../src/cases'

const content = () => h(VDropdownMenuItem, () => 'Save draft')
const renderContent = () => <DropdownMenuItem>Save draft</DropdownMenuItem>

type Props = Partial<Omit<SplitButtonProps, 'ref' | 'style' | `on${string}`>> & {
  class?: string
  style?: CSSProperties & VueCSSProperties
}

function pair(name: string, props: Props, reactProps: Props = props): ParityCase {
  return {
    name,
    vue: () => h(VSplitButton, props, { default: () => 'Publish', content }),
    react: () => (
      <SplitButton {...reactProps} renderContent={renderContent}>
        Publish
      </SplitButton>
    ),
  }
}

const variants = (['solid', 'soft', 'outline', 'ghost'] as const).flatMap(variant =>
  (['accent', 'neutral', 'danger'] as const).map(tone =>
    pair(`${variant} ${tone}`, { variant, tone }),
  ),
)

const sizes = (['xs', 'sm', 'md', 'lg'] as const).map(size => pair(`size ${size}`, { size }))

export default defineCases('SplitButton', [
  pair('default with the built-in menu label', {}),
  ...variants,
  ...sizes,
  pair('block and pill', { block: true, pill: true }),
  pair('without ripple', { ripple: false }),
  pair('loading blocks both controls', { loading: true }),
  pair('disabled blocks both controls', { disabled: true }),
  pair('primary disabled only', { primaryDisabled: true }),
  pair('menu disabled only', { menuDisabled: true }),
  pair('group label and menu label', { label: 'Publishing', menuLabel: 'Publishing options' }),
  pair('explicit rtl direction', { dir: 'rtl' }),
  pair('submit type with native name and value', { type: 'submit', name: 'intent', value: 'save' }),
  pair('link primary action', { as: 'a', href: '/document', 'aria-label': 'Open document' }),
  pair('placement and menu props stay off the server markup', {
    side: 'top',
    align: 'start',
    sideOffset: 4,
    modal: false,
    menuClass: 'w-64',
  }),
  pair(
    'class and style reach the group',
    { class: 'max-w-80', style: { marginInline: '4px' }, 'data-testid': 'split' },
    { className: 'max-w-80', style: { marginInline: '4px' }, 'data-testid': 'split' },
  ),
  pair('controlled open renders the collapsed trigger on the server', { open: true }),
  {
    name: 'icon and trailing slots',
    vue: () =>
      h(
        VSplitButton,
        {},
        {
          icon: () => h('svg', { 'data-icon': '' }),
          trailing: () => h('svg', { 'data-trailing': '' }),
          default: () => 'Publish',
          content,
        },
      ),
    react: () => (
      <SplitButton
        icon={<svg data-icon="" />}
        trailing={<svg data-trailing="" />}
        renderContent={renderContent}
      >
        Publish
      </SplitButton>
    ),
  },
  {
    name: 'English locale menu label',
    vue: () =>
      h(
        defineComponent({
          setup() {
            provideUiLocale(vueEnUS)
            return () => h(VSplitButton, {}, { default: () => 'Publish', content })
          },
        }),
      ),
    react: () => (
      <UiLocaleProvider messages={enUS}>
        <SplitButton renderContent={renderContent}>Publish</SplitButton>
      </UiLocaleProvider>
    ),
  },
])
