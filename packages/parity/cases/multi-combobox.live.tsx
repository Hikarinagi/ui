import { h } from 'vue'
import type { ReactElement } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VMultiCombobox from '@hina-ui/vue/components/multi-combobox/MultiCombobox.vue'
import { MultiCombobox } from '@hina-ui/react/components/multi-combobox/MultiCombobox'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

const wrapperSelector = '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]'

const options = [
  { value: 1, label: 'Key' },
  { value: 2, label: 'Type-Moon', description: '月姬' },
  { value: 3, label: 'Nitroplus', disabled: true },
  {
    label: '海外',
    options: [
      { value: 4, label: 'Sekai Project' },
      { value: 5, label: 'MangaGamer' },
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
    if (!document.querySelector('[data-hn-multi-combobox]')) throw new Error('not mounted')
  })
  await frames(6)
}

function wrap(vue: () => ReturnType<typeof h>, react: () => ReactElement) {
  return {
    vue: () => h('div', { style: 'width:320px;padding:40px' }, [vue()]),
    react: () => <div style={{ width: 320, padding: 40 }}>{react()}</div>,
  }
}

const input = (container: HTMLElement) =>
  container.querySelector<HTMLInputElement>('input[role="combobox"]')!

const cases: LiveCase[] = [
  {
    name: 'chips, clear action and hidden form values after mount',
    ...wrap(
      () =>
        h(VMultiCombobox, {
          options,
          modelValue: [1, 4],
          clearable: true,
          name: 'studios',
          'aria-label': '制作公司',
        }),
      () => (
        <MultiCombobox
          options={options}
          value={[1, 4]}
          clearable
          name="studios"
          aria-label="制作公司"
        />
      ),
    ),
    settle: mounted,
  },
  {
    name: 'opened by clicking the host with checked options',
    ...wrap(
      () => h(VMultiCombobox, { options, modelValue: [2, 5], 'aria-label': '制作公司' }),
      () => <MultiCombobox options={options} value={[2, 5]} aria-label="制作公司" />,
    ),
    interact: async container => {
      await userEvent.click(input(container))
    },
    settle: positioned,
  },
  {
    name: 'typing filters and Enter keeps the list open',
    ...wrap(
      () => h(VMultiCombobox, { options, 'aria-label': '制作公司' }),
      () => <MultiCombobox options={options} aria-label="制作公司" />,
    ),
    interact: async container => {
      input(container).focus()
      await userEvent.keyboard('key')
      await positioned()
      await userEvent.keyboard('{Enter}')
    },
    settle: positioned,
  },
  {
    name: 'backspace removes the last chip',
    ...wrap(
      () => h(VMultiCombobox, { options, modelValue: [1, 2], 'aria-label': '制作公司' }),
      () => <MultiCombobox options={options} defaultValue={[1, 2]} aria-label="制作公司" />,
    ),
    interact: async container => {
      await userEvent.click(input(container))
      await positioned()
      await userEvent.keyboard('{Backspace}')
      await userEvent.keyboard('{Escape}')
      await closed()
    },
    settle: mounted,
  },
  {
    name: 'remote results with selected option data while loading',
    ...wrap(
      () =>
        h(VMultiCombobox, {
          options: [{ value: 9, label: 'Remote' }],
          selectedOptions: [{ value: 1, label: 'Saved' }],
          modelValue: [1],
          ignoreFilter: true,
          loading: true,
          'aria-label': '制作公司',
        }),
      () => (
        <MultiCombobox
          options={[{ value: 9, label: 'Remote' }]}
          selectedOptions={[{ value: 1, label: 'Saved' }]}
          value={[1]}
          ignoreFilter
          loading
          aria-label="制作公司"
        />
      ),
    ),
    interact: async container => {
      input(container).focus()
      await userEvent.keyboard('zz')
    },
    settle: positioned,
  },
  {
    name: 'virtualized distant selections open',
    ...wrap(
      () =>
        h(VMultiCombobox, {
          options: many,
          virtualize: { estimateSize: 36, overscan: 6 },
          modelValue: [7890, 9999],
          open: true,
          'aria-label': '一万项',
        }),
      () => (
        <MultiCombobox
          options={many}
          virtualize={{ estimateSize: 36, overscan: 6 }}
          value={[7890, 9999]}
          open
          aria-label="一万项"
        />
      ),
    ),
    settle: positioned,
  },
]

export default defineLiveCases('MultiCombobox', cases)
