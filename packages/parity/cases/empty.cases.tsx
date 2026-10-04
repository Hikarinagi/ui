import { h } from 'vue'
import VEmpty from '@hina-ui/vue/components/empty/Empty.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { Empty } from '@hina-ui/react/components/empty/Empty'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineCases } from '../src/cases'

export default defineCases('Empty', [
  {
    name: 'default icon, title, description and actions',
    vue: () =>
      h(
        VEmpty,
        { title: '还没有书评', description: '读完一本书后来写第一篇。' },
        { actions: () => h(VButton, { size: 'sm' }, () => '写书评') },
      ),
    react: () => (
      <Empty
        title="还没有书评"
        description="读完一本书后来写第一篇。"
        actions={<Button size="sm">写书评</Button>}
      />
    ),
  },
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size} with default icon`,
    vue: () => h(VEmpty, { size, title: '没有评论', description: '来说点什么。' }),
    react: () => <Empty size={size} title="没有评论" description="来说点什么。" />,
  })),
  ...(['sm', 'md', 'lg'] as const).map(size => ({
    name: `size ${size} without icon`,
    vue: () => h(VEmpty, { size, icon: false, title: '没有评论', description: '来说点什么。' }),
    react: () => <Empty size={size} icon={false} title="没有评论" description="来说点什么。" />,
  })),
  {
    name: 'lazy image icon slot without the round backdrop',
    vue: () =>
      h(
        VEmpty,
        { title: '没有结果' },
        { icon: () => h('img', { src: 'x.png', alt: '', loading: 'lazy' }) },
      ),
    react: () => <Empty title="没有结果" icon={<img src="x.png" alt="" loading="lazy" />} />,
  },
  {
    name: 'icon slot wins over icon false',
    vue: () => h(VEmpty, { title: '没有结果', icon: false }, { icon: () => h('svg') }),
    react: () => <Empty title="没有结果" icon={<svg />} />,
  },
  {
    name: 'title only',
    vue: () => h(VEmpty, { title: '空', icon: false }),
    react: () => <Empty title="空" icon={false} />,
  },
  {
    name: 'description only',
    vue: () => h(VEmpty, { description: '说明', icon: false }),
    react: () => <Empty description="说明" icon={false} />,
  },
  {
    name: 'nothing but the default slot',
    vue: () => h(VEmpty, { icon: false }, () => h('p', '自定义')),
    react: () => (
      <Empty icon={false}>
        <p>自定义</p>
      </Empty>
    ),
  },
  {
    name: 'multiple actions, class merge and attributes',
    vue: () =>
      h(
        VEmpty,
        { title: '还没有书单', icon: false, class: 'w-96 py-4', id: 'empty' },
        {
          actions: () => [
            h(VButton, { size: 'sm' }, () => '新建书单'),
            h(VButton, { size: 'sm', variant: 'ghost', tone: 'neutral' }, () => '了解书单'),
          ],
        },
      ),
    react: () => (
      <Empty
        title="还没有书单"
        icon={false}
        className="w-96 py-4"
        id="empty"
        actions={
          <>
            <Button size="sm">新建书单</Button>
            <Button size="sm" variant="ghost" tone="neutral">
              了解书单
            </Button>
          </>
        }
      />
    ),
  },
])
