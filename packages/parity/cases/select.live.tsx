import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VSelect from '@hina-ui/vue/components/select/Select.vue'
import { Select } from '@hina-ui/react/components/select/Select'
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
    if (!document.querySelector('[data-hn-select]')) throw new Error('not mounted')
  })
  await frames(6)
}

const style = 'width:280px;padding:40px'
const reactStyle = { width: 280, padding: 40 }

function wrap(vue: () => ReturnType<typeof h>, react: () => React.ReactElement) {
  return {
    vue: () => h('div', { style }, [vue()]),
    react: () => <div style={reactStyle}>{react()}</div>,
  }
}

const trigger = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[data-hn-select-trigger]')!

const cases: LiveCase[] = [
  {
    name: 'closed after mount',
    ...wrap(
      () => h(VSelect, { options, modelValue: 'ln', 'aria-label': '类型' }),
      () => <Select options={options} value="ln" aria-label="类型" />,
    ),
    settle: mounted,
  },
  {
    name: 'clearable with a value after mount',
    ...wrap(
      () => h(VSelect, { options, modelValue: 'cd', clearable: true, 'aria-label': '类型' }),
      () => <Select options={options} value="cd" clearable aria-label="类型" />,
    ),
    settle: mounted,
  },
  {
    name: 'controlled open with groups, descriptions and disabled items',
    ...wrap(
      () => h(VSelect, { options, modelValue: 'ln', open: true, 'aria-label': '类型' }),
      () => <Select options={options} value="ln" open aria-label="类型" />,
    ),
    settle: positioned,
  },
  {
    name: 'opened by pointer',
    ...wrap(
      () => h(VSelect, { options, modelValue: 'cd', 'aria-label': '类型' }),
      () => <Select options={options} value="cd" aria-label="类型" />,
    ),
    interact: async container => {
      await userEvent.click(trigger(container))
    },
    settle: positioned,
  },
  {
    name: 'opened by keyboard and moved with arrows',
    ...wrap(
      () => h(VSelect, { options, modelValue: 'gal', 'aria-label': '类型' }),
      () => <Select options={options} value="gal" aria-label="类型" />,
    ),
    interact: async container => {
      trigger(container).focus()
      await userEvent.keyboard('{Enter}')
      await positioned()
      await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    },
    settle: positioned,
  },
  {
    name: 'empty options open',
    ...wrap(
      () => h(VSelect, { options: [], open: true, placeholder: '没有可选项', 'aria-label': '空' }),
      () => <Select options={[]} open placeholder="没有可选项" aria-label="空" />,
    ),
    settle: positioned,
  },
  {
    name: 'virtualized long list centered on a distant selection',
    ...wrap(
      () =>
        h(VSelect, {
          options: many,
          virtualize: { estimateSize: 36, overscan: 6 },
          modelValue: 7890,
          open: true,
          'aria-label': '一万项',
        }),
      () => (
        <Select
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
    name: 'virtualized long list after keyboard navigation to the end',
    ...wrap(
      () => h(VSelect, { options: many, virtualize: true, modelValue: 7890, open: true }),
      () => <Select options={many} virtualize value={7890} open />,
    ),
    interact: async () => {
      await positioned()
      await userEvent.keyboard('{End}')
      await vi.waitFor(() => {
        if (!document.activeElement?.textContent?.includes('Item 09999'))
          throw new Error('not at the end')
      })
    },
    settle: positioned,
  },
  {
    name: 'virtualized long list after scrolling',
    ...wrap(
      () => h(VSelect, { options: many, virtualize: true, modelValue: 120, open: true }),
      () => <Select options={many} virtualize value={120} open />,
    ),
    interact: async () => {
      await positioned()
      const viewport = document.querySelector<HTMLElement>('[data-overlayscrollbars-viewport]')!
      viewport.scrollTop += 600
      await frames(4)
    },
    settle: positioned,
  },
]

export default defineLiveCases('Select', cases)
