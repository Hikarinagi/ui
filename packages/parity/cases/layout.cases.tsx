import { h } from 'vue'
import VStack from '@hina-ui/vue/components/stack/Stack.vue'
import VInline from '@hina-ui/vue/components/inline/Inline.vue'
import VFlex from '@hina-ui/vue/components/flex/Flex.vue'
import VCard from '@hina-ui/vue/components/card/Card.vue'
import { Stack } from '@hina-ui/react/components/stack/Stack'
import { Inline } from '@hina-ui/react/components/inline/Inline'
import { Flex } from '@hina-ui/react/components/flex/Flex'
import { Card } from '@hina-ui/react/components/card/Card'
import { defineCases } from '../src/cases'

export default defineCases('Layout', [
  {
    name: 'Stack',
    vue: () => h(VStack, null, () => [h('span', 'a'), h('span', 'b')]),
    react: () => (
      <Stack>
        <span>a</span>
        <span>b</span>
      </Stack>
    ),
  },
  {
    name: 'Stack as section with gap, align and justify',
    vue: () => h(VStack, { as: 'section', gap: 'lg', align: 'center', justify: 'between' }),
    react: () => <Stack as="section" gap="lg" align="center" justify="between" />,
  },
  {
    name: 'Inline wraps by default',
    vue: () => h(VInline, { gap: 'sm', align: 'baseline' }),
    react: () => <Inline gap="sm" align="baseline" />,
  },
  {
    name: 'Inline without wrap',
    vue: () => h(VInline, { wrap: false, as: 'ul' }),
    react: () => <Inline wrap={false} as="ul" />,
  },
  {
    name: 'Flex',
    vue: () => h(VFlex, { direction: 'col', gap: 'md', wrap: true, class: 'p-2' }),
    react: () => <Flex direction="col" gap="md" wrap className="p-2" />,
  },
  {
    name: 'Card',
    vue: () => h(VCard, null, () => 'Body'),
    react: () => <Card>Body</Card>,
  },
  {
    name: 'Card as a link',
    vue: () =>
      h(VCard, { as: 'a', href: '/docs', target: '_blank', rel: 'noopener' }, () => 'Body'),
    react: () => (
      <Card as="a" href="/docs" target="_blank" rel="noopener">
        Body
      </Card>
    ),
  },
  {
    name: 'Card asChild lends its classes to the child',
    vue: () =>
      h(VCard, { asChild: true, padded: false, class: 'p-2' }, () =>
        h('a', { href: '/docs', class: 'block' }, 'Body'),
      ),
    react: () => (
      <Card asChild padded={false} className="p-2">
        <a href="/docs" className="block">
          Body
        </a>
      </Card>
    ),
  },
  {
    name: 'Card asChild with several children merges into the first, as Reka Slot does',
    vue: () =>
      h(VCard, { asChild: true }, () => [h('a', { href: '/docs' }, 'Docs'), h('span', 'tail')]),
    react: () => (
      <Card asChild>
        <a href="/docs">Docs</a>
        <span>tail</span>
      </Card>
    ),
  },
  {
    name: 'Stack as a link',
    vue: () => h(VStack, { as: 'a', href: '/docs', gap: 'sm' }, () => 'Docs'),
    react: () => (
      <Stack as="a" href="/docs" gap="sm">
        Docs
      </Stack>
    ),
  },
  {
    name: 'Card unpadded as article',
    vue: () => h(VCard, { padded: false, as: 'article' }, () => 'Body'),
    react: () => (
      <Card padded={false} as="article">
        Body
      </Card>
    ),
  },
])
