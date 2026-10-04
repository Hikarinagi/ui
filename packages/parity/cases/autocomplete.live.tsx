import { h } from 'vue'
import type { ReactElement } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VAutocomplete from '@hina-ui/vue/components/autocomplete/Autocomplete.vue'
import { Autocomplete } from '@hina-ui/react/components/autocomplete/Autocomplete'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

const wrapperSelector = '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]'

const options = [
  { value: 'status', label: 'status:', description: 'HTTP 状态' },
  { value: 'off', label: 'disabled', disabled: true },
  { value: 'duration', label: 'duration:' },
]

async function positioned() {
  await vi.waitFor(() => {
    const wrapper = document.querySelector<HTMLElement>(wrapperSelector)
    if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
  })
  const panel = document.querySelector<HTMLElement>(
    `${wrapperSelector.split(',')[0]} > *, ${wrapperSelector.split(',')[1]} > *`,
  )
  await Promise.allSettled(panel?.getAnimations().map(animation => animation.finished) ?? [])
  await vi.waitFor(() => {
    if (!document.querySelector('[data-overlayscrollbars-viewport]')) throw new Error('no viewport')
  })
  await frames(6)
}

async function closed() {
  await vi.waitFor(() => {
    if (document.querySelector(wrapperSelector)) throw new Error('still open')
  })
  await frames(6)
}

async function mounted() {
  await vi.waitFor(() => {
    if (!document.querySelector('[data-hn-autocomplete]')) throw new Error('not mounted')
  })
  await frames(6)
}

function wrap(vue: () => ReturnType<typeof h>, react: () => ReactElement) {
  return {
    vue: () => h('div', { style: 'width:320px;padding:40px' }, [vue()]),
    react: () => <div style={{ width: 320, padding: 40 }}>{react()}</div>,
  }
}

const input = (container: HTMLElement) => container.querySelector<HTMLInputElement>('input')!

const cases: LiveCase[] = [
  {
    name: 'closed with free text after mount',
    ...wrap(
      () => h(VAutocomplete, { options, modelValue: 'entry:http', 'aria-label': 'Query' }),
      () => <Autocomplete options={options} defaultValue="entry:http" aria-label="Query" />,
    ),
    settle: mounted,
  },
  {
    name: 'opened by clicking without a highlighted suggestion',
    ...wrap(
      () => h(VAutocomplete, { options, 'aria-label': 'Query' }),
      () => <Autocomplete options={options} aria-label="Query" />,
    ),
    interact: async container => {
      await userEvent.click(input(container))
    },
    settle: positioned,
  },
  {
    name: 'arrow keys skip disabled suggestions',
    ...wrap(
      () => h(VAutocomplete, { options, placeholder: '输入', 'aria-label': 'Query' }),
      () => <Autocomplete options={options} placeholder="输入" aria-label="Query" />,
    ),
    interact: async container => {
      await userEvent.click(input(container))
      await positioned()
      await userEvent.keyboard('{ArrowDown}{ArrowDown}')
    },
    settle: positioned,
  },
  {
    name: 'pointer highlight and selection',
    ...wrap(
      () => h(VAutocomplete, { options, 'aria-label': 'Query' }),
      () => <Autocomplete options={options} aria-label="Query" />,
    ),
    interact: async container => {
      await userEvent.click(input(container))
      await positioned()
      await userEvent.click(document.querySelectorAll<HTMLElement>('[role="option"]')[2]!)
      await closed()
    },
    settle: mounted,
  },
  {
    name: 'loading and empty states',
    ...wrap(
      () => h(VAutocomplete, { options: [], loading: true, 'aria-label': 'Query' }),
      () => <Autocomplete options={[]} loading aria-label="Query" />,
    ),
    interact: async container => {
      await userEvent.click(input(container))
    },
    settle: positioned,
  },
  {
    name: 'empty results',
    ...wrap(
      () => h(VAutocomplete, { options: [], modelValue: 'zzz', 'aria-label': 'Query' }),
      () => <Autocomplete options={[]} defaultValue="zzz" aria-label="Query" />,
    ),
    interact: async container => {
      await userEvent.click(input(container))
    },
    settle: positioned,
  },
  {
    name: 'Escape closes the suggestions',
    ...wrap(
      () => h(VAutocomplete, { options, modelValue: 'draft', 'aria-label': 'Query' }),
      () => <Autocomplete options={options} defaultValue="draft" aria-label="Query" />,
    ),
    interact: async container => {
      await userEvent.click(input(container))
      await positioned()
      await userEvent.keyboard('{Escape}')
      await frames(30)
    },
    settle: mounted,
  },
]

export default defineLiveCases('Autocomplete', cases)
