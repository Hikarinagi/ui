import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VAnchor from '@hina-ui/vue/components/anchor/Anchor.vue'
import VTag from '@hina-ui/vue/components/tag/Tag.vue'
import { Anchor } from '@hina-ui/react/components/anchor/Anchor'
import { Tag } from '@hina-ui/react/components/tag/Tag'
import { defineLiveCases, frames } from '../src/live'

interface Item {
  id: string
  label: string
  modified?: boolean
  children?: Item[]
}

async function idle() {
  let last = ''
  let stable = 0
  await vi.waitFor(
    () => {
      const running = document.getAnimations().filter(a => a.playState === 'running')
      if (running.length) throw new Error('busy')
      const viewport = document.querySelector<HTMLElement>('[data-viewport]')
      const highlight = document.querySelector('[data-hn-highlight]')
      const key = JSON.stringify([
        viewport?.scrollTop,
        highlight?.getBoundingClientRect(),
        (highlight as HTMLElement | null)?.style.transform,
      ])
      stable = key === last ? stable + 1 : 0
      last = key
      if (stable < 10) throw new Error('moving')
    },
    { timeout: 4000, interval: 16 },
  )
  await frames(4)
  history.replaceState(null, '', location.pathname)
}

const flat = (items: Item[]) => items.flatMap(item => [item, ...(item.children ?? [])])

function vueScene(items: Item[], trailing = false) {
  return () =>
    h('div', { style: { display: 'flex', gap: '16px' } }, [
      h(
        'div',
        { 'data-viewport': '', style: { height: '200px', width: '300px', overflow: 'auto' } },
        flat(items).map(item =>
          h('section', { id: item.id, style: { height: '160px' } }, item.label),
        ),
      ),
      h(
        VAnchor,
        { items, class: 'w-44' },
        trailing
          ? {
              trailing: ({ item, active }: { item: Item; active: boolean }) =>
                item.modified
                  ? h(VTag, { tone: active ? 'accent' : 'neutral' }, () => '已修改')
                  : null,
            }
          : undefined,
      ),
    ])
}

function reactScene(items: Item[], trailing = false) {
  return () => (
    <div style={{ display: 'flex', gap: '16px' }}>
      <div data-viewport="" style={{ height: '200px', width: '300px', overflow: 'auto' }}>
        {flat(items).map(item => (
          <section key={item.id} id={item.id} style={{ height: '160px' }}>
            {item.label}
          </section>
        ))}
      </div>
      <Anchor
        items={items}
        className="w-44"
        renderTrailing={
          trailing
            ? ({ item, active }) =>
                item.modified ? <Tag tone={active ? 'accent' : 'neutral'}>已修改</Tag> : null
            : undefined
        }
      />
    </div>
  )
}

const items: Item[] = [
  { id: 'live-a', label: '简介' },
  {
    id: 'live-b',
    label: '路线',
    children: [
      { id: 'live-b1', label: '共通线' },
      { id: 'live-b2', label: '个人线' },
    ],
  },
  { id: 'live-c', label: '制作人员' },
]

const marked: Item[] = [
  { id: 'mark-a', label: '条目 A', modified: true },
  {
    id: 'mark-b',
    label: '条目 B',
    modified: false,
    children: [{ id: 'mark-c', label: '子条目', modified: true }],
  },
]

const viewport = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[data-viewport]')!
const links = (container: HTMLElement) => [...container.querySelectorAll<HTMLElement>('a')]

const live = (
  name: string,
  list: Item[],
  interact?: (container: HTMLElement) => Promise<void>,
  trailing = false,
) => ({
  name,
  vue: vueScene(list, trailing),
  react: reactScene(list, trailing),
  interact,
  settle: idle,
})

export default defineLiveCases('Anchor', [
  live('observer marks the first visible section and fades the highlight in', items),
  live('click jumps to a nested entry and moves the highlight', items, async container => {
    await idle()
    await userEvent.click(links(container)[2]!)
  }),
  live('scrolling spans the highlight across every visible section', items, async container => {
    await idle()
    viewport(container).scrollTop = 250
  }),
  live('scrolling to the end activates the last entry', items, async container => {
    await idle()
    viewport(container).scrollTop = 10000
  }),
  live('keyboard Enter on a focused link jumps there', items, async container => {
    await idle()
    links(container)[4]!.focus()
    await userEvent.keyboard('{Enter}')
  }),
  live(
    'trailing marks follow the active entry',
    marked,
    async container => {
      await idle()
      await userEvent.click(links(container)[2]!)
    },
    true,
  ),
])
