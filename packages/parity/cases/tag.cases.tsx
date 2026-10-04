import { h } from 'vue'
import VTag from '@hina-ui/vue/components/tag/Tag.vue'
import VText from '@hina-ui/vue/components/text/Text.vue'
import { Tag } from '@hina-ui/react/components/tag/Tag'
import { Text } from '@hina-ui/react/components/text/Text'
import { defineCases } from '../src/cases'

const variants = ['soft', 'solid', 'outline'] as const
const tones = ['neutral', 'accent', 'success', 'warning', 'danger', 'info'] as const

export default defineCases('Tag', [
  {
    name: 'default',
    vue: () => h(VTag, null, () => '科幻'),
    react: () => <Tag>科幻</Tag>,
  },
  ...variants.flatMap(variant =>
    tones.map(tone => ({
      name: `${variant} ${tone}`,
      vue: () => h(VTag, { variant, tone }, () => '标签'),
      react: () => (
        <Tag variant={variant} tone={tone}>
          标签
        </Tag>
      ),
    })),
  ),
  {
    name: 'size md',
    vue: () => h(VTag, { size: 'md' }, () => '标签'),
    react: () => <Tag size="md">标签</Tag>,
  },
  {
    name: 'pill solid accent',
    vue: () => h(VTag, { pill: true, variant: 'solid', tone: 'accent' }, () => '胶囊'),
    react: () => (
      <Tag pill variant="solid" tone="accent">
        胶囊
      </Tag>
    ),
  },
  {
    name: 'as li',
    vue: () => h('ul', [h(VTag, { as: 'li' }, () => '科幻'), h(VTag, { as: 'li' }, () => '悬疑')]),
    react: () => (
      <ul>
        <Tag as="li">科幻</Tag>
        <Tag as="li">悬疑</Tag>
      </ul>
    ),
  },
  {
    name: 'icon and text',
    vue: () => h(VTag, { tone: 'success' }, () => [h('svg', { 'data-icon': '' }), '已通过']),
    react: () => (
      <Tag tone="success">
        <svg data-icon="" />
        已通过
      </Tag>
    ),
  },
  {
    name: 'truncating content with class merge',
    vue: () =>
      h(VTag, { class: 'max-w-40', tone: 'accent' }, () =>
        h(VText, { as: 'span', truncate: true }, () => '很长很长的标签名称'),
      ),
    react: () => (
      <Tag className="max-w-40" tone="accent">
        <Text as="span" truncate>
          很长很长的标签名称
        </Text>
      </Tag>
    ),
  },
  {
    name: 'as child',
    vue: () => h(VTag, { asChild: true, tone: 'info' }, () => h('a', { href: '/tags/x' }, 'X')),
    react: () => (
      <Tag asChild tone="info">
        <a href="/tags/x">X</a>
      </Tag>
    ),
  },
])
