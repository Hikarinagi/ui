import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

const variants = ['solid', 'soft', 'outline', 'ghost', 'link'] as const
const tones = ['accent', 'neutral', 'danger'] as const

export default defineCases('Button', [
  {
    name: 'default',
    vue: () => h(V.Button, null, () => 'Save'),
    react: () => <R.Button>Save</R.Button>,
  },
  ...variants.flatMap(variant =>
    tones.map(tone => ({
      name: `${variant} ${tone}`,
      vue: () => h(V.Button, { variant, tone }, () => 'Save'),
      react: () => (
        <R.Button variant={variant} tone={tone}>
          Save
        </R.Button>
      ),
    })),
  ),
  ...(['xs', 'sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size}`,
    vue: () => h(V.Button, { size, pill: true, block: true }, () => 'Save'),
    react: () => (
      <R.Button size={size} pill block>
        Save
      </R.Button>
    ),
  })),
  {
    name: 'icon and trailing',
    vue: () =>
      h(V.Button, null, {
        icon: () => h('svg', { 'data-icon': 'leading' }),
        default: () => 'Next',
        trailing: () => h('svg', { 'data-icon': 'trailing' }),
      }),
    react: () => (
      <R.Button icon={<svg data-icon="leading" />} trailing={<svg data-icon="trailing" />}>
        Next
      </R.Button>
    ),
  },
  {
    name: 'loading in the center',
    vue: () => h(V.Button, { loading: true }, () => 'Save'),
    react: () => <R.Button loading>Save</R.Button>,
  },
  {
    name: 'loading replaces the icon',
    vue: () => h(V.Button, { loading: true }, { icon: () => h('svg'), default: () => 'Save' }),
    react: () => (
      <R.Button loading icon={<svg />}>
        Save
      </R.Button>
    ),
  },
  {
    name: 'disabled native button',
    vue: () => h(V.Button, { disabled: true, type: 'submit' }, () => 'Send'),
    react: () => (
      <R.Button disabled type="submit">
        Send
      </R.Button>
    ),
  },
  {
    name: 'disabled link',
    vue: () => h(V.Button, { as: 'a', href: '/next', disabled: true }, () => 'Next'),
    react: () => (
      <R.Button as="a" href="/next" disabled>
        Next
      </R.Button>
    ),
  },
  {
    name: 'icon only with a label',
    vue: () => h(V.Button, { iconOnly: true, 'aria-label': 'Close' }, { icon: () => h('svg') }),
    react: () => <R.Button iconOnly aria-label="Close" icon={<svg />} />,
  },
  {
    name: 'without ripple',
    vue: () => h(V.Button, { ripple: false, class: 'w-40' }, () => 'Plain'),
    react: () => (
      <R.Button ripple={false} className="w-40">
        Plain
      </R.Button>
    ),
  },
  {
    name: 'caller attributes win over component attributes',
    vue: () =>
      h(V.Button, { as: 'a', disabled: true, tabindex: 0, 'aria-busy': 'false' }, () => 'Go'),
    react: () => (
      <R.Button as="a" disabled tabIndex={0} aria-busy="false">
        Go
      </R.Button>
    ),
  },
  {
    name: 'IconButton as child renders only its child',
    vue: () =>
      h(V.IconButton, { asChild: true, label: 'Docs' }, () => h('a', { href: '/docs' }, 'D')),
    react: () => (
      <R.IconButton asChild label="Docs">
        <a href="/docs">D</a>
      </R.IconButton>
    ),
  },
  {
    name: 'as child',
    vue: () => h(V.Button, { asChild: true }, () => h('a', { href: '/docs' }, 'Docs')),
    react: () => (
      <R.Button asChild>
        <a href="/docs">Docs</a>
      </R.Button>
    ),
  },
])
