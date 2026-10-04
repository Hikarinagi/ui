import { h } from 'vue'
import type { ReactElement } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VCombobox from '@hina-ui/vue/components/combobox/Combobox.vue'
import { Combobox } from '@hina-ui/react/components/combobox/Combobox'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

const wrapperSelector = '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说', description: '文库本' },
  { value: 'manga', label: '漫画', disabled: true },
  {
    label: '周边',
    options: [
      { value: 'cd', label: '音乐 CD' },
      { value: 'book', label: '设定集' },
    ],
  },
]
const many = Array.from({ length: 10000 }, (_, value) => ({
  value,
  label: `Item ${String(value).padStart(5, '0')}`,
  disabled: value % 97 === 0,
}))

async function positioned() {
  await vi.waitFor(() => {
    const wrapper = document.querySelector<HTMLElement>(wrapperSelector)
    if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
  })
  const panel = document.querySelector<HTMLElement>('[data-hn-combobox-content]')!
  await Promise.allSettled(panel.getAnimations().map(animation => animation.finished))
  await vi.waitFor(() => {
    if (!document.querySelector('[data-overlayscrollbars-viewport]')) throw new Error('no viewport')
  })
  await frames(6)
}

async function closed() {
  await vi.waitFor(() => {
    if (document.querySelector('[data-hn-combobox-content]')) throw new Error('still open')
  })
  await frames(6)
}

async function mounted() {
  await vi.waitFor(() => {
    if (!document.querySelector('[data-hn-combobox]')) throw new Error('not mounted')
  })
  await frames(6)
}

function wrap(vue: () => ReturnType<typeof h>, react: () => ReactElement) {
  return {
    vue: () => h('div', { style: 'width:280px;padding:40px' }, [vue()]),
    react: () => <div style={{ width: 280, padding: 40 }}>{react()}</div>,
  }
}

const input = (container: HTMLElement) => container.querySelector<HTMLInputElement>('input')!
const toggle = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('button[aria-label="展开选项"]')!

const cases: LiveCase[] = [
  {
    name: 'closed with a selected label and clear action after mount',
    ...wrap(
      () => h(VCombobox, { options, modelValue: 'ln', clearable: true, 'aria-label': '类型' }),
      () => <Combobox options={options} value="ln" clearable aria-label="类型" />,
    ),
    settle: mounted,
  },
  {
    name: 'opened by clicking the input highlights the selected option',
    ...wrap(
      () => h(VCombobox, { options, modelValue: 'ln', 'aria-label': '类型' }),
      () => <Combobox options={options} value="ln" aria-label="类型" />,
    ),
    interact: async container => {
      await userEvent.click(input(container))
    },
    settle: positioned,
  },
  {
    name: 'opened by clicking without a selection highlights the first option',
    ...wrap(
      () => h(VCombobox, { options, 'aria-label': '类型' }),
      () => <Combobox options={options} aria-label="类型" />,
    ),
    interact: async container => {
      await userEvent.click(input(container))
    },
    settle: positioned,
  },
  {
    name: 'opened by the toggle button',
    ...wrap(
      () => h(VCombobox, { options, modelValue: 'cd', 'aria-label': '类型' }),
      () => <Combobox options={options} value="cd" aria-label="类型" />,
    ),
    interact: async container => {
      await userEvent.click(toggle(container))
    },
    settle: positioned,
  },
  {
    name: 'opened by keyboard and moved down',
    ...wrap(
      () => h(VCombobox, { options, modelValue: 'gal', 'aria-label': '类型' }),
      () => <Combobox options={options} value="gal" aria-label="类型" />,
    ),
    interact: async container => {
      input(container).focus()
      await userEvent.keyboard('{ArrowDown}')
      await positioned()
      await userEvent.keyboard('{ArrowDown}')
    },
    settle: positioned,
  },
  {
    name: 'typing filters options and hides empty groups',
    ...wrap(
      () => h(VCombobox, { options, 'aria-label': '类型' }),
      () => <Combobox options={options} aria-label="类型" />,
    ),
    interact: async container => {
      await userEvent.click(input(container))
      await positioned()
      await userEvent.keyboard('音')
    },
    settle: positioned,
  },
  {
    name: 'typing without matches shows the empty state',
    ...wrap(
      () => h(VCombobox, { options, 'aria-label': '类型' }),
      () => <Combobox options={options} aria-label="类型" />,
    ),
    interact: async container => {
      input(container).focus()
      await userEvent.keyboard('zzz')
    },
    settle: positioned,
  },
  {
    name: 'selecting closes the list and writes the label back',
    ...wrap(
      () => h(VCombobox, { options, clearable: true, 'aria-label': '类型' }),
      () => <Combobox options={options} clearable aria-label="类型" />,
    ),
    interact: async container => {
      await userEvent.click(input(container))
      await positioned()
      await userEvent.click(document.querySelectorAll<HTMLElement>('[role="option"]')[1]!)
      await closed()
    },
    settle: mounted,
  },
  {
    name: 'ignore filter keeps every option while typing',
    ...wrap(
      () => h(VCombobox, { options, ignoreFilter: true, loading: true, 'aria-label': '类型' }),
      () => <Combobox options={options} ignoreFilter loading aria-label="类型" />,
    ),
    interact: async container => {
      await userEvent.click(input(container))
      await positioned()
      await userEvent.keyboard('远程')
    },
    settle: positioned,
  },
  {
    name: 'controlled open',
    ...wrap(
      () => h(VCombobox, { options, open: true, modelValue: 'book', 'aria-label': '类型' }),
      () => <Combobox options={options} open value="book" aria-label="类型" />,
    ),
    settle: positioned,
  },
  {
    name: 'virtualized open at a distant selection',
    ...wrap(
      () =>
        h(VCombobox, {
          options: many,
          virtualize: { estimateSize: 36, overscan: 6 },
          modelValue: 7890,
          open: true,
          'aria-label': '一万项',
        }),
      () => (
        <Combobox
          options={many}
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
    name: 'virtualized search across unmounted options',
    ...wrap(
      () => h(VCombobox, { options: many, virtualize: true, 'aria-label': '一万项' }),
      () => <Combobox options={many} virtualize aria-label="一万项" />,
    ),
    interact: async container => {
      await userEvent.click(input(container))
      await positioned()
      await userEvent.keyboard('09998')
    },
    settle: positioned,
  },
]

export default defineLiveCases('Combobox', cases)
