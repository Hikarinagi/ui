import { h, type VNode } from 'vue'
import type { ReactElement } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VTree from '@hina-ui/vue/components/tree/Tree.vue'
import { Tree } from '@hina-ui/react/components/tree/Tree'
import type { TreeNode } from '@hina-ui/react/components/tree/types'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

const nodes: TreeNode[] = [
  {
    value: 'root',
    label: 'Root',
    children: [
      {
        value: 'branch',
        label: 'Branch',
        children: [
          { value: 'a', label: 'Alpha' },
          { value: 'b', label: 'Beta', description: 'Second leaf' },
        ],
      },
      { value: 'c', label: 'Gamma' },
      {
        value: 'disabled',
        label: 'Disabled',
        disabled: true,
        children: [{ value: 'locked-child', label: 'Locked child' }],
      },
    ],
  },
  { value: 'empty-branch', label: 'Empty branch', children: [] },
  { value: 'zeta', label: 'Zeta' },
]
const many = Array.from({ length: 10000 }, (_, value) => ({
  value,
  label: `Node ${String(value).padStart(5, '0')}`,
  disabled: value % 97 === 0,
}))
const nested: TreeNode[] = [{ value: 'root', label: 'All', children: many }]

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

async function mounted() {
  await vi.waitFor(() => {
    if (!document.querySelector('[data-hn-tree]')) throw new Error('not mounted')
  })
  await frames(6)
  await still()
}

async function virtualReady() {
  await vi.waitFor(() => {
    if (!document.querySelector('[data-overlayscrollbars-viewport]')) throw new Error('no viewport')
    if (!document.querySelector('[data-hn-virtual-tree]')) throw new Error('no virtual tree')
  })
  await frames(8)
  await still()
}

function wrap(
  vue: () => VNode,
  react: () => ReactElement,
  dir: 'ltr' | 'rtl' = 'ltr',
): Pick<LiveCase, 'vue' | 'react'> {
  return {
    vue: () =>
      h('div', { dir, style: 'width:420px;padding:20px' }, [
        h('button', { 'data-before': '' }, 'Before'),
        vue(),
      ]),
    react: () => (
      <div dir={dir} style={{ width: 420, padding: 20 }}>
        <button data-before="">Before</button>
        {react()}
      </div>
    ),
  }
}

const before = (container: HTMLElement) => container.querySelector<HTMLElement>('[data-before]')!
const row = (name: string) =>
  [...document.querySelectorAll<HTMLElement>('[role="treeitem"]')].find(
    element => element.querySelector('.block.truncate, b')?.textContent === name,
  )!
const toggle = (name: string) => row(name).querySelector<HTMLElement>('[data-hn-tree-toggle]')!

async function focusTree(container: HTMLElement) {
  await userEvent.click(before(container))
  await userEvent.keyboard('{Tab}')
}

const cases: LiveCase[] = [
  {
    name: 'multiple with mixed ancestors after mount',
    ...wrap(
      () =>
        h(VTree, {
          items: nodes,
          multiple: true,
          modelValue: ['a'],
          defaultExpanded: ['root', 'branch'],
          'aria-label': 'Nodes',
        }),
      () => (
        <Tree
          items={nodes}
          multiple
          defaultValue={['a']}
          defaultExpanded={['root', 'branch']}
          aria-label="Nodes"
        />
      ),
    ),
    settle: mounted,
  },
  {
    name: 'single selection after mount',
    ...wrap(
      () => h(VTree, { items: nodes, modelValue: 'c', defaultExpanded: ['root'] }),
      () => <Tree items={nodes} defaultValue="c" defaultExpanded={['root']} />,
    ),
    settle: mounted,
  },
  {
    name: 'tab entry, keyboard expansion and Space checks',
    ...wrap(
      () => h(VTree, { items: nodes, multiple: true, modelValue: [], 'aria-label': 'Nodes' }),
      () => <Tree items={nodes} multiple defaultValue={[]} aria-label="Nodes" />,
    ),
    interact: async container => {
      await mounted()
      await focusTree(container)
      await userEvent.keyboard('{ArrowRight}{ArrowRight} {ArrowDown}{ArrowRight}{ArrowRight}')
    },
    settle: mounted,
  },
  {
    name: 'keyboard collapse, parent return, Home and End',
    ...wrap(
      () => h(VTree, { items: nodes, defaultExpanded: ['root', 'branch'] }),
      () => <Tree items={nodes} defaultExpanded={['root', 'branch']} />,
    ),
    interact: async container => {
      await mounted()
      await focusTree(container)
      await userEvent.keyboard('{ArrowDown}{ArrowDown}{ArrowLeft}{ArrowLeft}{End}{Home}{Enter}')
    },
    settle: mounted,
  },
  {
    name: 'rtl keyboard expansion',
    ...wrap(
      () => h(VTree, { items: nodes, multiple: true, modelValue: ['c'], dir: 'rtl' }),
      () => <Tree items={nodes} multiple defaultValue={['c']} dir="rtl" />,
      'rtl',
    ),
    interact: async container => {
      await mounted()
      await focusTree(container)
      await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowRight}')
    },
    settle: mounted,
  },
  {
    name: 'typeahead',
    ...wrap(
      () => h(VTree, { items: nodes, defaultExpanded: ['root'] }),
      () => <Tree items={nodes} defaultExpanded={['root']} />,
    ),
    interact: async container => {
      await mounted()
      await focusTree(container)
      await userEvent.keyboard('z')
    },
    settle: mounted,
  },
  {
    name: 'pointer selection and toggle',
    ...wrap(
      () => h(VTree, { items: nodes, modelValue: null }),
      () => <Tree items={nodes} defaultValue={null} />,
    ),
    interact: async () => {
      await mounted()
      await userEvent.click(toggle('Root'))
      await userEvent.click(toggle('Branch'))
      await userEvent.click(row('Beta'))
      await userEvent.click(toggle('Branch'))
    },
    settle: mounted,
  },
  {
    name: 'pointer checks in multiple mode',
    ...wrap(
      () =>
        h(VTree, {
          items: nodes,
          multiple: true,
          modelValue: ['locked-child'],
          defaultExpanded: ['root', 'disabled'],
        }),
      () => (
        <Tree
          items={nodes}
          multiple
          defaultValue={['locked-child']}
          defaultExpanded={['root', 'disabled']}
        />
      ),
    ),
    interact: async () => {
      await mounted()
      await userEvent.click(row('Root'))
      await userEvent.click(row('Gamma'))
    },
    settle: mounted,
  },
  {
    name: 'globally disabled after mount',
    ...wrap(
      () =>
        h(VTree, {
          items: nodes,
          multiple: true,
          disabled: true,
          modelValue: ['c'],
          defaultExpanded: ['root'],
        }),
      () => (
        <Tree items={nodes} multiple disabled defaultValue={['c']} defaultExpanded={['root']} />
      ),
    ),
    settle: mounted,
  },
  {
    name: 'custom node and trailing slots after a check',
    ...wrap(
      () =>
        h(
          VTree,
          { items: nodes, multiple: true, modelValue: [], defaultExpanded: ['root'] },
          {
            node: ({ node, expanded }: { node: TreeNode; expanded: boolean }) =>
              h('b', { 'data-open': String(expanded) }, node.label),
            trailing: ({
              indeterminate,
              selected,
            }: {
              indeterminate: boolean
              selected: boolean
            }) => h('i', indeterminate ? 'Mixed' : selected ? 'Checked' : ''),
          },
        ),
      () => (
        <Tree
          items={nodes}
          multiple
          defaultValue={[]}
          defaultExpanded={['root']}
          renderNode={({ node, expanded }) => <b data-open={String(expanded)}>{node.label}</b>}
          renderTrailing={({ indeterminate, selected }) => (
            <i>{indeterminate ? 'Mixed' : selected ? 'Checked' : ''}</i>
          )}
        />
      ),
    ),
    interact: async () => {
      await mounted()
      await userEvent.click(row('Gamma'))
    },
    settle: mounted,
  },
  {
    name: 'empty after mount',
    ...wrap(
      () => h(VTree, { items: [], 'aria-label': 'Nothing' }),
      () => <Tree items={[]} aria-label="Nothing" />,
    ),
    settle: mounted,
  },
  {
    name: 'virtualized distant selection after mount',
    ...wrap(
      () =>
        h(VTree, {
          items: nested,
          virtualize: { estimateSize: 36, overscan: 6 },
          multiple: true,
          modelValue: [7890],
          defaultExpanded: ['root'],
          maxHeight: 320,
          'aria-label': '一万项',
        }),
      () => (
        <Tree
          items={nested}
          virtualize={{ estimateSize: 36, overscan: 6 }}
          multiple
          defaultValue={[7890]}
          defaultExpanded={['root']}
          maxHeight={320}
          aria-label="一万项"
        />
      ),
    ),
    settle: virtualReady,
  },
  {
    name: 'virtualized keyboard navigation to the end and back',
    ...wrap(
      () => h(VTree, { items: nested, virtualize: true, defaultExpanded: ['root'] }),
      () => <Tree items={nested} virtualize defaultExpanded={['root']} />,
    ),
    interact: async container => {
      await virtualReady()
      await focusTree(container)
      await userEvent.keyboard('{End}')
      await vi.waitFor(() => {
        if (!document.activeElement?.textContent?.includes('Node 09999'))
          throw new Error('not at the end')
      })
      await userEvent.keyboard('{PageUp}{ArrowUp}')
      await frames(4)
    },
    settle: virtualReady,
  },
  {
    name: 'virtualized typeahead and collapse to the parent',
    ...wrap(
      () =>
        h(VTree, {
          items: nested,
          virtualize: true,
          multiple: true,
          modelValue: [],
          defaultExpanded: ['root'],
        }),
      () => (
        <Tree items={nested} virtualize multiple defaultValue={[]} defaultExpanded={['root']} />
      ),
    ),
    interact: async container => {
      await virtualReady()
      await focusTree(container)
      await userEvent.keyboard('{ArrowRight}')
      await userEvent.keyboard('N')
      await frames(2)
      await userEvent.keyboard(' ')
      await still()
      await userEvent.keyboard('{ArrowLeft}')
      await frames(4)
    },
    settle: virtualReady,
  },
  {
    name: 'virtualized pointer expansion',
    ...wrap(
      () => h(VTree, { items: nested, virtualize: true, maxHeight: '12rem' }),
      () => <Tree items={nested} virtualize maxHeight="12rem" />,
    ),
    interact: async () => {
      await virtualReady()
      await userEvent.click(toggle('All'))
      await frames(4)
      await userEvent.click(row('Node 00002'))
    },
    settle: virtualReady,
  },
]

export default defineLiveCases('Tree', cases)
