import { h } from 'vue'
import VPanel from '@hina-ui/vue/components/panel/Panel.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { Panel } from '@hina-ui/react/components/panel/Panel'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineCases } from '../src/cases'

export default defineCases('Panel', [
  {
    name: 'title, description and body',
    vue: () =>
      h(VPanel, { title: '最近活动', description: '过去七天' }, { default: () => h('p', '正文') }),
    react: () => (
      <Panel title="最近活动" description="过去七天">
        <p>正文</p>
      </Panel>
    ),
  },
  {
    name: 'title only renders no body',
    vue: () => h(VPanel, { title: '空面板' }),
    react: () => <Panel title="空面板" />,
  },
  ...([3, 4] as const).map(level => ({
    name: `level ${level} with count, icon and actions`,
    vue: () =>
      h(
        VPanel,
        { title: '评论', level, count: 12 },
        {
          actions: () => h(VButton, { size: 'sm' }, () => '全部'),
          icon: () => h('svg'),
          default: () => h('p', '内容'),
        },
      ),
    react: () => (
      <Panel
        title="评论"
        level={level}
        count={12}
        actions={<Button size="sm">全部</Button>}
        icon={<svg />}
      >
        <p>内容</p>
      </Panel>
    ),
  })),
  {
    name: 'zero count',
    vue: () => h(VPanel, { title: '最近活动', count: 0 }),
    react: () => <Panel title="最近活动" count={0} />,
  },
  {
    name: 'unpadded body',
    vue: () => h(VPanel, { title: '列表', padded: false }, { default: () => h('ul') }),
    react: () => (
      <Panel title="列表" padded={false}>
        <ul />
      </Panel>
    ),
  },
  {
    name: 'title and description slots',
    vue: () =>
      h(
        VPanel,
        { title: '忽略' },
        {
          title: () => h('span', { 'data-title': '' }, '自定义标题'),
          description: () => h('a', { href: '#' }, '说明链接'),
        },
      ),
    react: () => (
      <Panel title={<span data-title="">自定义标题</span>} description={<a href="#">说明链接</a>} />
    ),
  },
  {
    name: 'empty description is omitted',
    vue: () => h(VPanel, { title: '标题', description: '' }),
    react: () => <Panel title="标题" description="" />,
  },
  {
    name: 'class merge and attributes reach the card',
    vue: () =>
      h(VPanel, { title: '成员', class: 'w-96 gap-2', id: 'members', as: 'section' }, () => 'x'),
    react: () => (
      <Panel title="成员" className="w-96 gap-2" id="members" as="section">
        x
      </Panel>
    ),
  },
])
