import { h } from 'vue'
import VSkeleton from '@hina-ui/vue/components/skeleton/Skeleton.vue'
import VText from '@hina-ui/vue/components/text/Text.vue'
import { Skeleton } from '@hina-ui/react/components/skeleton/Skeleton'
import { Text } from '@hina-ui/react/components/text/Text'
import { defineCases } from '../src/cases'

export default defineCases('Skeleton', [
  {
    name: 'wraps content while loading',
    vue: () => h(VSkeleton, null, () => h('p', '正文')),
    react: () => (
      <Skeleton>
        <p>正文</p>
      </Skeleton>
    ),
  },
  {
    name: 'renders only the content when ready',
    vue: () => h(VSkeleton, { loading: false }, () => h('p', '正文')),
    react: () => (
      <Skeleton loading={false}>
        <p>正文</p>
      </Skeleton>
    ),
  },
  {
    name: 'standalone placeholder with class',
    vue: () => h(VSkeleton, { class: 'h-4 w-32' }),
    react: () => <Skeleton className="h-4 w-32" />,
  },
  {
    name: 'class merge overrides display',
    vue: () => h(VSkeleton, { class: 'inline-block size-10 rounded-full' }),
    react: () => <Skeleton className="inline-block size-10 rounded-full" />,
  },
  {
    name: 'as div with attributes',
    vue: () => h(VSkeleton, { as: 'div', id: 'cover', 'data-x': '1' }),
    react: () => <Skeleton as="div" id="cover" data-x="1" />,
  },
  {
    name: 'wraps a component',
    vue: () =>
      h(VSkeleton, { loading: true }, () =>
        h(VText, { tone: 'muted', size: 'sm' }, () => '第 42 章'),
      ),
    react: () => (
      <Skeleton loading>
        <Text tone="muted" size="sm">
          第 42 章
        </Text>
      </Skeleton>
    ),
  },
])
