import { h } from 'vue'
import * as V from '@hina-ui/vue'
import * as R from '@hina-ui/react'
import { defineCases } from '../src/cases'

export default defineCases('Typography', [
  {
    name: 'Text defaults',
    vue: () => h(V.Text, null, () => 'Body'),
    react: () => <R.Text>Body</R.Text>,
  },
  {
    name: 'Text as span with tone, weight and truncate',
    vue: () =>
      h(
        V.Text,
        { as: 'span', size: 'sm', tone: 'muted', weight: 'medium', truncate: true, id: 'x' },
        () => 'Muted',
      ),
    react: () => (
      <R.Text as="span" size="sm" tone="muted" weight="medium" truncate id="x">
        Muted
      </R.Text>
    ),
  },
  {
    name: 'Text asChild lends its classes to the child',
    vue: () => h(V.Text, { asChild: true, tone: 'muted' }, () => h('a', { href: '/docs' }, 'Docs')),
    react: () => (
      <R.Text asChild tone="muted">
        <a href="/docs">Docs</a>
      </R.Text>
    ),
  },
  {
    name: 'Text as a link',
    vue: () => h(V.Text, { as: 'a', href: '/docs', size: 'sm' }, () => 'Docs'),
    react: () => (
      <R.Text as="a" href="/docs" size="sm">
        Docs
      </R.Text>
    ),
  },
  {
    name: 'Text inherits size',
    vue: () => h(V.Text, { size: 'inherit', class: 'mt-2' }, () => 'Inherit'),
    react: () => (
      <R.Text size="inherit" className="mt-2">
        Inherit
      </R.Text>
    ),
  },
  ...([1, 2, 3, 4, 5, 6] as const).map(level => ({
    name: `Heading level ${level}`,
    vue: () => h(V.Heading, { level }, () => 'Title'),
    react: () => <R.Heading level={level}>Title</R.Heading>,
  })),
  {
    name: 'Heading with explicit size and weight',
    vue: () => h(V.Heading, { level: 3, size: '2xl', weight: 'medium', truncate: true }, () => 'T'),
    react: () => (
      <R.Heading level={3} size="2xl" weight="medium" truncate>
        T
      </R.Heading>
    ),
  },
  {
    name: 'VisuallyHidden',
    vue: () => h(V.VisuallyHidden, { id: 'hint' }, () => 'Required'),
    react: () => <R.VisuallyHidden id="hint">Required</R.VisuallyHidden>,
  },
  {
    name: 'VisuallyHidden lets caller styles win',
    vue: () => h(V.VisuallyHidden, { style: { top: '0px' } }, () => 'Required'),
    react: () => <R.VisuallyHidden style={{ top: '0px' }}>Required</R.VisuallyHidden>,
  },
  {
    name: 'Spinner keeps its own animation over caller style',
    vue: () => h(V.Spinner, { style: { animation: 'none', color: 'red' } }),
    react: () => <R.Spinner style={{ animation: 'none', color: 'red' }} />,
  },
  {
    name: 'Spinner',
    vue: () => h(V.Spinner, { size: 'lg', class: 'text-accent' }),
    react: () => <R.Spinner size="lg" className="text-accent" />,
  },
  {
    name: 'Spinner with label',
    vue: () => h(V.Spinner, { label: 'Uploading' }),
    react: () => <R.Spinner label="Uploading" />,
  },
])
