import { h } from 'vue'
import type { ReactElement } from 'react'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VTagsInput from '@hina-ui/vue/components/tags-input/TagsInput.vue'
import { TagsInput } from '@hina-ui/react/components/tags-input/TagsInput'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

async function mounted() {
  await vi.waitFor(() => {
    if (!document.querySelector('[data-hn-tags-input]')) throw new Error('not mounted')
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
  container.querySelector<HTMLInputElement>('input[type="text"]')!

const cases: LiveCase[] = [
  {
    name: 'tags, clear action and hidden form values after mount',
    ...wrap(
      () =>
        h(VTagsInput, {
          modelValue: ['galgame', 'manga'],
          clearable: true,
          name: 'tags',
          'aria-label': '标签',
        }),
      () => <TagsInput value={['galgame', 'manga']} clearable name="tags" aria-label="标签" />,
    ),
    settle: mounted,
  },
  {
    name: 'focused by clicking a tag',
    ...wrap(
      () => h(VTagsInput, { modelValue: ['galgame', 'manga'], 'aria-label': '标签' }),
      () => <TagsInput value={['galgame', 'manga']} aria-label="标签" />,
    ),
    interact: async container => {
      await userEvent.click(container.querySelector('[data-hn-chip] .truncate')!)
    },
    settle: mounted,
  },
  {
    name: 'adding tags by Enter and delimiter, then removing by Backspace',
    ...wrap(
      () => h(VTagsInput, { 'aria-label': '标签', placeholder: '添加' }),
      () => <TagsInput aria-label="标签" placeholder="添加" />,
    ),
    interact: async container => {
      input(container).focus()
      await userEvent.keyboard('galgame{Enter}')
      await userEvent.keyboard('manga,anime,')
      await userEvent.keyboard('{Backspace}')
    },
    settle: mounted,
  },
  {
    name: 'duplicate tag marks the input invalid',
    ...wrap(
      () => h(VTagsInput, { modelValue: ['a'], 'aria-label': '标签' }),
      () => <TagsInput value={['a']} aria-label="标签" />,
    ),
    interact: async container => {
      input(container).focus()
      await userEvent.keyboard('a{Enter}')
    },
    settle: mounted,
  },
  {
    name: 'arrow keys with text never select a tag',
    ...wrap(
      () => h(VTagsInput, { modelValue: ['one', 'two'], 'aria-label': '标签' }),
      () => <TagsInput value={['one', 'two']} aria-label="标签" />,
    ),
    interact: async container => {
      input(container).focus()
      await userEvent.keyboard('ab{Home}{ArrowLeft}')
    },
    settle: mounted,
  },
  {
    name: 'disabled',
    ...wrap(
      () => h(VTagsInput, { modelValue: ['one'], disabled: true, clearable: true }),
      () => <TagsInput value={['one']} disabled clearable />,
    ),
    settle: mounted,
  },
]

export default defineLiveCases('TagsInput', cases)
