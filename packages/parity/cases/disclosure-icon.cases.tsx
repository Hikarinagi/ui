import { h } from 'vue'
import VDisclosureIcon from '@hina-ui/vue/components/disclosure-icon/DisclosureIcon.vue'
import { DisclosureIcon } from '@hina-ui/react/components/disclosure-icon/DisclosureIcon'
import { defineCases } from '../src/cases'

export default defineCases('DisclosureIcon', [
  {
    name: 'default follows the disclosure group',
    vue: () => h(VDisclosureIcon),
    react: () => <DisclosureIcon />,
  },
  {
    name: 'direction end',
    vue: () => h(VDisclosureIcon, { direction: 'end' }),
    react: () => <DisclosureIcon direction="end" />,
  },
  ...([true, false] as const).flatMap(open =>
    (['down', 'end'] as const).map(direction => ({
      name: `open ${open} direction ${direction}`,
      vue: () => h(VDisclosureIcon, { open, direction }),
      react: () => <DisclosureIcon open={open} direction={direction} />,
    })),
  ),
  {
    name: 'custom icon keeps rotation on the wrapper',
    vue: () => h(VDisclosureIcon, { open: true }, () => h('i', { class: 'custom-mark' })),
    react: () => (
      <DisclosureIcon open>
        <i className="custom-mark" />
      </DisclosureIcon>
    ),
  },
  {
    name: 'class merge',
    vue: () => h(VDisclosureIcon, { class: 'text-muted size-4' }),
    react: () => <DisclosureIcon className="text-muted size-4" />,
  },
])
