import { h } from 'vue'
import type { ReactElement } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VListbox from '@hina-ui/vue/components/listbox/Listbox.vue'
import { Listbox } from '@hina-ui/react/components/listbox/Listbox'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说', description: '文库本' },
  { value: 'manga', label: '漫画', disabled: true },
  { label: '周边', options: [{ value: 'cd', label: '音乐 CD' }] },
]
const many: Array<{ value: number; label: string; disabled: boolean }> = Array.from(
  { length: 10000 },
  (_, value) => ({
    value,
    label: `Item ${String(value).padStart(5, '0')}`,
    disabled: value % 97 === 0,
  }),
)

const groups = Array.from({ length: 100 }, (_, group) => ({
  label: `Group ${group}`,
  options: many.slice(group * 10, group * 10 + 10),
}))

async function ready() {
  await vi.waitFor(() => {
    if (!document.querySelector('[data-overlayscrollbars-viewport]')) throw new Error('no viewport')
    if (!document.querySelector('[role="option"][data-highlighted]'))
      throw new Error('no highlight')
  })
  await frames(6)
}

function wrap(vue: () => ReturnType<typeof h>, react: () => ReactElement) {
  return {
    vue: () => h('div', { style: 'width:280px;padding:40px' }, [vue()]),
    react: () => <div style={{ width: 280, padding: 40 }}>{react()}</div>,
  }
}

const list = (container: HTMLElement) => container.querySelector<HTMLElement>('[role="listbox"]')!

const cases: LiveCase[] = [
  {
    name: 'mounted with a selection',
    ...wrap(
      () => h(VListbox, { options, modelValue: 'ln', 'aria-label': '类型' }),
      () => <Listbox options={options} value="ln" aria-label="类型" />,
    ),
    settle: ready,
  },
  {
    name: 'mounted without a selection',
    ...wrap(
      () => h(VListbox, { options, 'aria-label': '类型' }),
      () => <Listbox options={options} aria-label="类型" />,
    ),
    settle: ready,
  },
  {
    name: 'keyboard entry and navigation skipping disabled items',
    ...wrap(
      () => h(VListbox, { options, 'aria-label': '类型' }),
      () => <Listbox options={options} aria-label="类型" />,
    ),
    interact: async () => {
      await ready()
      await userEvent.keyboard('{Tab}{ArrowDown}{ArrowDown}')
    },
    settle: ready,
  },
  {
    name: 'multiple selection after clicks',
    ...wrap(
      () => h(VListbox, { options, multiple: true, modelValue: ['gal'], 'aria-label': '类型' }),
      () => <Listbox options={options} multiple defaultValue={['gal']} aria-label="类型" />,
    ),
    interact: async container => {
      await ready()
      await userEvent.click(container.querySelectorAll<HTMLElement>('[role="option"]')[3]!)
    },
    settle: ready,
  },
  {
    name: 'bare unpadded with a scroll limit',
    ...wrap(
      () =>
        h(VListbox, {
          options: many.slice(0, 30),
          variant: 'bare',
          padded: false,
          maxHeight: '8rem',
          modelValue: 20,
          'aria-label': '年份',
        }),
      () => (
        <Listbox
          options={many.slice(0, 30)}
          variant="bare"
          padded={false}
          maxHeight="8rem"
          value={20}
          aria-label="年份"
        />
      ),
    ),
    settle: ready,
  },
  {
    name: 'virtualized with a distant selection after mount',
    ...wrap(
      () =>
        h(VListbox, {
          options: many,
          virtualize: { estimateSize: 36, overscan: 6 },
          modelValue: 7890,
          'aria-label': '一万项',
        }),
      () => (
        <Listbox
          options={many}
          virtualize={{ estimateSize: 36, overscan: 6 }}
          value={7890}
          aria-label="一万项"
        />
      ),
    ),
    settle: ready,
  },
  {
    name: 'virtualized after keyboard navigation to the end',
    ...wrap(
      () => h(VListbox, { options: many, virtualize: true, 'aria-label': 'Items' }),
      () => <Listbox options={many} virtualize aria-label="Items" />,
    ),
    interact: async container => {
      await ready()
      list(container).focus()
      await userEvent.keyboard('{End}')
      await vi.waitFor(() => {
        if (!document.activeElement?.textContent?.includes('Item 09999'))
          throw new Error('not at the end')
      })
    },
    settle: ready,
  },
  {
    name: 'virtualized grouped rows after mount',
    ...wrap(
      () =>
        h(VListbox, { options: groups, virtualize: true, modelValue: 515, 'aria-label': 'Groups' }),
      () => <Listbox options={groups} virtualize value={515} aria-label="Groups" />,
    ),
    settle: ready,
  },
  {
    name: 'virtualized rows after scrolling',
    ...wrap(
      () =>
        h(VListbox, {
          options: many,
          virtualize: { estimateSize: 38 },
          modelValue: 30,
          'aria-label': 'Items',
        }),
      () => (
        <Listbox options={many} virtualize={{ estimateSize: 38 }} value={30} aria-label="Items" />
      ),
    ),
    interact: async () => {
      await ready()
      const viewport = document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]')!
      viewport.scrollTop += 2400
      await frames(4)
      await new Promise(resolve => setTimeout(resolve, 300))
    },
    settle: ready,
  },
]

export default defineLiveCases('Listbox', cases)
