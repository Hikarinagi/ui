import { h } from 'vue'
import VBadge from '@hina-ui/vue/components/badge/Badge.vue'
import VIndicator from '@hina-ui/vue/components/indicator/Indicator.vue'
import { Badge } from '@hina-ui/react/components/badge/Badge'
import { Indicator } from '@hina-ui/react/components/indicator/Indicator'
import { defineCases } from '../src/cases'

const host = () => h('span', { style: 'display:inline-block;width:40px;height:40px' }, '宿主')
const Host = () => (
  <span style={{ display: 'inline-block', width: '40px', height: '40px' }}>宿主</span>
)

const tones = ['danger', 'accent', 'neutral', 'success', 'warning', 'info'] as const
const placements = ['top-end', 'top-start', 'bottom-end', 'bottom-start'] as const

export default defineCases('Badge', [
  {
    name: 'number content',
    vue: () => h(VBadge, { content: 5 }, { default: host }),
    react: () => (
      <Badge content={5}>
        <Host />
      </Badge>
    ),
  },
  {
    name: 'capped at the default max',
    vue: () => h(VBadge, { content: 120 }, { default: host }),
    react: () => (
      <Badge content={120}>
        <Host />
      </Badge>
    ),
  },
  {
    name: 'custom max',
    vue: () => h(VBadge, { content: 1280, max: 999 }, { default: host }),
    react: () => (
      <Badge content={1280} max={999}>
        <Host />
      </Badge>
    ),
  },
  {
    name: 'equal to max is not capped',
    vue: () => h(VBadge, { content: 99 }, { default: host }),
    react: () => (
      <Badge content={99}>
        <Host />
      </Badge>
    ),
  },
  ...([0, '', undefined, null] as const).map(content => ({
    name: `hidden for ${JSON.stringify(content) ?? 'undefined'}`,
    vue: () => h(VBadge, { content }, { default: host }),
    react: () => (
      <Badge content={content}>
        <Host />
      </Badge>
    ),
  })),
  {
    name: 'text content at md size',
    vue: () => h(VBadge, { content: 'NEW', tone: 'success', size: 'md' }, { default: host }),
    react: () => (
      <Badge content="NEW" tone="success" size="md">
        <Host />
      </Badge>
    ),
  },
  {
    name: 'label for screen readers',
    vue: () => h(VBadge, { content: 3, label: '3 条未读通知' }, { default: host }),
    react: () => (
      <Badge content={3} label="3 条未读通知">
        <Host />
      </Badge>
    ),
  },
  {
    name: 'content slot replaces the text',
    vue: () =>
      h(VBadge, { content: 1 }, { default: host, content: () => h('i', { 'data-probe': '' }) }),
    react: () => (
      <Badge content={<i data-probe="" />}>
        <Host />
      </Badge>
    ),
  },
  ...tones.map(tone => ({
    name: `tone ${tone}`,
    vue: () => h(VBadge, { content: 6, tone }, { default: host }),
    react: () => (
      <Badge content={6} tone={tone}>
        <Host />
      </Badge>
    ),
  })),
  ...placements.flatMap(placement =>
    (['rect', 'circle'] as const).map(shape => ({
      name: `placement ${placement} on ${shape}`,
      vue: () => h(VBadge, { content: 2, placement, shape }, { default: host }),
      react: () => (
        <Badge content={2} placement={placement} shape={shape}>
          <Host />
        </Badge>
      ),
    })),
  ),
  {
    name: 'without outline',
    vue: () => h(VBadge, { content: 9, outline: false }, { default: host }),
    react: () => (
      <Badge content={9} outline={false}>
        <Host />
      </Badge>
    ),
  },
  {
    name: 'bare badge carrying an indicator',
    vue: () =>
      h(
        VBadge,
        { content: 'online', bare: true, label: '在线', placement: 'bottom-end', shape: 'circle' },
        { default: host, content: () => h(VIndicator, { tone: 'success', size: 'lg' }) },
      ),
    react: () => (
      <Badge
        content={<Indicator tone="success" size="lg" />}
        bare
        label="在线"
        placement="bottom-end"
        shape="circle"
      >
        <Host />
      </Badge>
    ),
  },
  {
    name: 'class merge and fallthrough attributes',
    vue: () =>
      h(VBadge, { content: 4, class: 'align-top', id: 'b', 'data-x': '1' }, { default: host }),
    react: () => (
      <Badge content={4} className="align-top" id="b" data-x="1">
        <Host />
      </Badge>
    ),
  },
])
