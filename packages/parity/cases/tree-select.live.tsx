import { h, type VNode } from 'vue'
import type { ReactElement } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VTreeSelect from '@hina-ui/vue/components/tree-select/TreeSelect.vue'
import VFormField from '@hina-ui/vue/components/form-field/FormField.vue'
import { TreeSelect } from '@hina-ui/react/components/tree-select/TreeSelect'
import { FormField } from '@hina-ui/react/components/form-field/FormField'
import type { TreeSelectNode } from '@hina-ui/react/components/tree-select/types'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

const wrapperSelector = '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]'

const regions: TreeSelectNode[] = [
  {
    value: 'jp',
    label: '日本',
    children: [
      {
        value: 'kanto',
        label: '关东',
        children: [
          { value: 'tokyo', label: '东京' },
          { value: 'yokohama', label: '横滨', description: '神奈川' },
        ],
      },
      { value: 'osaka', label: '大阪', disabled: true },
    ],
  },
  { value: 'cn', label: '中国', children: [{ value: 'shanghai', label: '上海' }] },
  { value: 'kr', label: '韩国' },
]
const many = Array.from({ length: 10000 }, (_, value) => ({
  value,
  label: `Node ${String(value).padStart(5, '0')}`,
  disabled: value % 97 === 0,
}))
const nested: TreeSelectNode[] = [{ value: 'root', label: 'All', children: many }]

async function still() {
  await frames(2)
  await Promise.race([
    Promise.allSettled(
      document
        .getAnimations()
        .filter(
          animation =>
            animation.playState === 'running' &&
            animation.timeline === document.timeline &&
            animation.effect?.getComputedTiming().endTime !== Infinity,
        )
        .map(animation => animation.finished),
    ),
    new Promise(resolve => setTimeout(resolve, 1000)),
  ])
  await frames(4)
}

async function positioned() {
  await vi.waitFor(() => {
    const wrapper = document.querySelector<HTMLElement>(wrapperSelector)
    if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
    if (!document.querySelector('[data-overlayscrollbars-viewport]')) throw new Error('no viewport')
  })
  await frames(6)
  await still()
}

async function mounted() {
  await vi.waitFor(() => {
    if (!document.querySelector('[data-hn-tree-select]')) throw new Error('not mounted')
  })
  await frames(6)
  await still()
}

async function closed() {
  await vi.waitFor(() => {
    if (document.querySelector('[data-hn-tree-select-content]')) throw new Error('still open')
  })
  await mounted()
}

function wrap(vue: () => VNode, react: () => ReactElement): Pick<LiveCase, 'vue' | 'react'> {
  return {
    vue: () => h('div', { style: 'width:280px;padding:40px' }, [vue()]),
    react: () => <div style={{ width: 280, padding: 40 }}>{react()}</div>,
  }
}

const trigger = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[data-hn-tree-select]')!
const row = (name: string) =>
  [...document.querySelectorAll<HTMLElement>('[role="treeitem"]')].find(
    element => element.querySelector('.block.truncate, b')?.textContent === name,
  )!
const searchbox = () => document.querySelector<HTMLInputElement>('[role="searchbox"]')!

const cases: LiveCase[] = [
  {
    name: 'closed with a nested selection after mount',
    ...wrap(
      () => h(VTreeSelect, { items: regions, modelValue: 'yokohama', 'aria-label': '地区' }),
      () => <TreeSelect items={regions} value="yokohama" aria-label="地区" />,
    ),
    settle: mounted,
  },
  {
    name: 'controlled open expands the selected path',
    ...wrap(
      () =>
        h(VTreeSelect, {
          items: regions,
          modelValue: 'yokohama',
          open: true,
          'aria-label': '地区',
        }),
      () => <TreeSelect items={regions} value="yokohama" open aria-label="地区" />,
    ),
    settle: positioned,
  },
  {
    name: 'opened by pointer and expanded with the chevron',
    ...wrap(
      () => h(VTreeSelect, { items: regions, placeholder: '选择地区', 'aria-label': '地区' }),
      () => <TreeSelect items={regions} placeholder="选择地区" aria-label="地区" />,
    ),
    interact: async container => {
      await userEvent.click(trigger(container))
      await positioned()
      await userEvent.click(row('日本').querySelector<HTMLElement>('span')!)
      await userEvent.click(row('关东').querySelector<HTMLElement>('span')!)
    },
    settle: positioned,
  },
  {
    name: 'opened by keyboard and navigated',
    ...wrap(
      () => h(VTreeSelect, { items: regions, defaultExpanded: ['jp'], 'aria-label': '地区' }),
      () => <TreeSelect items={regions} defaultExpanded={['jp']} aria-label="地区" />,
    ),
    interact: async container => {
      trigger(container).focus()
      await userEvent.keyboard('{Enter}')
      await positioned()
      await userEvent.keyboard('{Home}{ArrowDown}{ArrowRight}{ArrowDown}')
    },
    settle: positioned,
  },
  {
    name: 'pointer selection closes and updates the trigger',
    ...wrap(
      () => h(VTreeSelect, { items: regions, modelValue: null, 'aria-label': '地区' }),
      () => <TreeSelect items={regions} defaultValue={null} aria-label="地区" />,
    ),
    interact: async container => {
      await userEvent.click(trigger(container))
      await positioned()
      await userEvent.click(row('中国'))
    },
    settle: closed,
  },
  {
    name: 'searchable open with a filter',
    ...wrap(
      () =>
        h(VTreeSelect, {
          items: regions,
          searchable: true,
          searchPlaceholder: '搜索节点',
          modelValue: 'tokyo',
          'aria-label': '地区',
        }),
      () => (
        <TreeSelect
          items={regions}
          searchable
          searchPlaceholder="搜索节点"
          defaultValue="tokyo"
          aria-label="地区"
        />
      ),
    ),
    interact: async container => {
      await userEvent.click(trigger(container))
      await positioned()
      await userEvent.fill(searchbox(), '横')
    },
    settle: positioned,
  },
  {
    name: 'searchable with no results',
    ...wrap(
      () => h(VTreeSelect, { items: regions, searchable: true, 'aria-label': '地区' }),
      () => <TreeSelect items={regions} searchable aria-label="地区" />,
    ),
    interact: async container => {
      await userEvent.click(trigger(container))
      await positioned()
      await userEvent.fill(searchbox(), '不存在')
    },
    settle: positioned,
  },
  {
    name: 'search arrows move into the tree',
    ...wrap(
      () => h(VTreeSelect, { items: regions, searchable: true, 'aria-label': '地区' }),
      () => <TreeSelect items={regions} searchable aria-label="地区" />,
    ),
    interact: async container => {
      await userEvent.click(trigger(container))
      await positioned()
      await userEvent.fill(searchbox(), '东')
      await userEvent.keyboard('{ArrowUp}')
    },
    settle: positioned,
  },
  {
    name: 'custom node content open',
    ...wrap(
      () =>
        h(
          VTreeSelect,
          { items: regions, modelValue: 'tokyo', open: true, 'aria-label': '地区' },
          { node: ({ node }: { node: TreeSelectNode }) => h('b', node.label) },
        ),
      () => (
        <TreeSelect
          items={regions}
          value="tokyo"
          open
          aria-label="地区"
          renderNode={({ node }) => <b>{node.label}</b>}
        />
      ),
    ),
    settle: positioned,
  },
  {
    name: 'virtualized open at a distant selection',
    ...wrap(
      () =>
        h(VTreeSelect, {
          items: nested,
          virtualize: { estimateSize: 36, overscan: 6 },
          modelValue: 7890,
          open: true,
          'aria-label': '一万项',
        }),
      () => (
        <TreeSelect
          items={nested}
          virtualize={{ estimateSize: 36, overscan: 6 }}
          value={7890}
          open
          aria-label="一万项"
        />
      ),
    ),
    settle: positioned,
  },
  {
    name: 'virtualized searchable keyboard navigation',
    ...wrap(
      () =>
        h(VTreeSelect, {
          items: nested,
          virtualize: true,
          searchable: true,
          defaultExpanded: ['root'],
          open: true,
        }),
      () => <TreeSelect items={nested} virtualize searchable defaultExpanded={['root']} open />,
    ),
    interact: async () => {
      await positioned()
      await userEvent.click(searchbox())
      await userEvent.keyboard('{ArrowUp}')
      await vi.waitFor(() => {
        if (!document.activeElement?.textContent?.includes('Node 09999'))
          throw new Error('not at the end')
      })
      await userEvent.keyboard('{PageUp}')
      await frames(4)
    },
    settle: positioned,
  },
  {
    name: 'virtualized search results',
    ...wrap(
      () =>
        h(VTreeSelect, {
          items: nested,
          virtualize: true,
          searchable: true,
          open: true,
          'aria-label': '一万项',
        }),
      () => <TreeSelect items={nested} virtualize searchable open aria-label="一万项" />,
    ),
    interact: async () => {
      await positioned()
      await userEvent.fill(searchbox(), 'Node 0789')
      await frames(4)
      await userEvent.keyboard('{ArrowDown}')
    },
    settle: positioned,
  },
  {
    name: 'escape clears the search before closing',
    ...wrap(
      () => h(VTreeSelect, { items: regions, searchable: true, 'aria-label': '地区' }),
      () => <TreeSelect items={regions} searchable aria-label="地区" />,
    ),
    interact: async container => {
      await userEvent.click(trigger(container))
      await positioned()
      await userEvent.fill(searchbox(), '东')
      await frames(2)
      await userEvent.keyboard('{Escape}')
    },
    settle: positioned,
  },
  {
    name: 'clear action empties the search',
    ...wrap(
      () => h(VTreeSelect, { items: regions, searchable: true, 'aria-label': '地区' }),
      () => <TreeSelect items={regions} searchable aria-label="地区" />,
    ),
    interact: async container => {
      await userEvent.click(trigger(container))
      await positioned()
      await userEvent.fill(searchbox(), '横')
      await still()
      await userEvent.click(document.querySelector<HTMLElement>('[aria-label="清除"]')!)
    },
    settle: positioned,
  },
  {
    name: 'escape closes and restores the trigger',
    ...wrap(
      () => h(VTreeSelect, { items: regions, modelValue: 'tokyo', 'aria-label': '地区' }),
      () => <TreeSelect items={regions} defaultValue="tokyo" aria-label="地区" />,
    ),
    interact: async container => {
      await userEvent.click(trigger(container))
      await positioned()
      await userEvent.keyboard('{Escape}')
    },
    settle: closed,
  },
  {
    name: 'clicking the selected node keeps the popup open',
    ...wrap(
      () => h(VTreeSelect, { items: regions, modelValue: 'kr', 'aria-label': '地区' }),
      () => <TreeSelect items={regions} defaultValue="kr" aria-label="地区" />,
    ),
    interact: async container => {
      await userEvent.click(trigger(container))
      await positioned()
      await userEvent.click(row('韩国'))
    },
    settle: positioned,
  },
  {
    name: 'inside a form field when open',
    vue: () =>
      h('div', { style: 'width:280px;padding:40px' }, [
        h(VFormField, { label: '地区', description: '选择一个节点' }, () =>
          h(VTreeSelect, { items: regions, searchable: true, open: true }),
        ),
      ]),
    react: () => (
      <div style={{ width: 280, padding: 40 }}>
        <FormField label="地区" description="选择一个节点">
          <TreeSelect items={regions} searchable open />
        </FormField>
      </div>
    ),
    settle: positioned,
  },
]

export default defineLiveCases('TreeSelect', cases)
