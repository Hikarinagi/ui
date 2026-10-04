import { h } from 'vue'
import type { ReactElement } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VMultiSelect from '@hina-ui/vue/components/multi-select/MultiSelect.vue'
import { MultiSelect } from '@hina-ui/react/components/multi-select/MultiSelect'
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
  const panel = document.querySelector<HTMLElement>('[data-hn-select-content]')!
  await Promise.allSettled(panel.getAnimations().map(animation => animation.finished))
  await vi.waitFor(() => {
    if (!document.querySelector('[data-overlayscrollbars-viewport]')) throw new Error('no viewport')
  })
  await frames(6)
}

async function mounted() {
  await vi.waitFor(() => {
    if (!document.querySelector('[data-hn-multi-select]')) throw new Error('not mounted')
  })
  await frames(6)
}

function wrap(vue: () => ReturnType<typeof h>, react: () => ReactElement) {
  return {
    vue: () => h('div', { style: 'width:320px;padding:40px' }, [vue()]),
    react: () => <div style={{ width: 320, padding: 40 }}>{react()}</div>,
  }
}

const trigger = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[data-hn-multi-select]')!

const cases: LiveCase[] = [
  {
    name: 'chips, overflow and clear after mount',
    ...wrap(
      () =>
        h(VMultiSelect, {
          options,
          modelValue: ['gal', 'ln', 'cd'],
          clearable: true,
          name: 'kind',
          'aria-label': '类型',
        }),
      () => (
        <MultiSelect
          options={options}
          value={['gal', 'ln', 'cd']}
          clearable
          name="kind"
          aria-label="类型"
        />
      ),
    ),
    settle: mounted,
  },
  {
    name: 'controlled open with multiple checked items',
    ...wrap(
      () =>
        h(VMultiSelect, { options, modelValue: ['ln', 'book'], open: true, 'aria-label': '类型' }),
      () => <MultiSelect options={options} value={['ln', 'book']} open aria-label="类型" />,
    ),
    settle: positioned,
  },
  {
    name: 'opened by pointer and toggled by keyboard',
    ...wrap(
      () => h(VMultiSelect, { options, modelValue: ['gal'], 'aria-label': '类型' }),
      () => <MultiSelect options={options} value={['gal']} aria-label="类型" />,
    ),
    interact: async container => {
      await userEvent.click(trigger(container))
      await positioned()
      await userEvent.keyboard('{ArrowDown}')
    },
    settle: positioned,
  },
  {
    name: 'opened by keyboard',
    ...wrap(
      () => h(VMultiSelect, { options, 'aria-label': '类型' }),
      () => <MultiSelect options={options} aria-label="类型" />,
    ),
    interact: async container => {
      trigger(container).focus()
      await userEvent.keyboard('{Enter}')
    },
    settle: positioned,
  },
  {
    name: 'virtualized distant selections open',
    ...wrap(
      () =>
        h(VMultiSelect, {
          options: many,
          virtualize: { estimateSize: 36, overscan: 6 },
          modelValue: [7890, 9999],
          open: true,
          'aria-label': '一万项',
        }),
      () => (
        <MultiSelect
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
  {
    name: 'virtualized after keyboard navigation',
    ...wrap(
      () => h(VMultiSelect, { options: many, virtualize: true, modelValue: [5000], open: true }),
      () => <MultiSelect options={many} virtualize value={[5000]} open />,
    ),
    interact: async () => {
      await positioned()
      await userEvent.keyboard('{PageDown}{ArrowDown}')
    },
    settle: positioned,
  },
]

export default defineLiveCases('MultiSelect', cases)
