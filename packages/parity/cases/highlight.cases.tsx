import { h } from 'vue'
import VHighlight from '@hina-ui/vue/components/highlight/Highlight.vue'
import { Highlight } from '@hina-ui/react/components/highlight/Highlight'
import { defineCases } from '../src/cases'

export default defineCases('Highlight', [
  {
    name: 'default',
    vue: () => h(VHighlight),
    react: () => <Highlight />,
  },
  ...(['x', 'y', 'both'] as const).map(axis => ({
    name: `as li with axis ${axis}`,
    vue: () => h(VHighlight, { axis, as: 'li', class: 'absolute inset-0' }),
    react: () => <Highlight axis={axis} as="li" className="absolute inset-0" />,
  })),
  {
    name: 'shared layout id is not an attribute',
    vue: () =>
      h(VHighlight, {
        id: 'tabs',
        axis: 'x',
        class: 'bg-surface absolute inset-0 -z-10 rounded-md shadow-sm',
      }),
    react: () => (
      <Highlight
        id="tabs"
        axis="x"
        className="bg-surface absolute inset-0 -z-10 rounded-md shadow-sm"
      />
    ),
  },
  {
    name: 'style falls through',
    vue: () =>
      h(VHighlight, {
        axis: 'y',
        style: { gridRow: '2 / 4' },
        class: 'bg-accent-soft col-start-1 -z-10 rounded-md',
      }),
    react: () => (
      <Highlight
        axis="y"
        style={{ gridRow: '2 / 4' }}
        className="bg-accent-soft col-start-1 -z-10 rounded-md"
      />
    ),
  },
])
