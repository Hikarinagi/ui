import { defineComponent, h, ref } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import { useState } from 'react'
import VChip from '@hina-ui/vue/components/chip/Chip.vue'
import { Chip } from '@hina-ui/react/components/chip/Chip'
import { defineLiveCases, frames } from '../src/live'

async function idle() {
  await vi.waitFor(
    () => {
      const running = document.getAnimations().filter(a => a.playState === 'running')
      if (running.length || document.querySelector('[data-pressed]')) throw new Error('busy')
    },
    { timeout: 3000 },
  )
  await frames(4)
}

const tags = ['科幻', '校园', '恋爱', '群像']

const VueRemovable = defineComponent(() => {
  const list = ref([...tags])
  return () =>
    h(
      'div',
      { class: 'flex gap-2' },
      list.value.map(tag =>
        h(
          VChip,
          {
            key: tag,
            removable: true,
            onRemove: () => (list.value = list.value.filter(item => item !== tag)),
          },
          () => tag,
        ),
      ),
    )
})

function ReactRemovable() {
  const [list, setList] = useState(tags)
  return (
    <div className="flex gap-2">
      {list.map(tag => (
        <Chip key={tag} removable onRemove={() => setList(list.filter(item => item !== tag))}>
          {tag}
        </Chip>
      ))}
    </div>
  )
}

const chip = (container: HTMLElement) => container.querySelector<HTMLElement>('[data-hn-chip]')!
const star = () => h('svg', { 'data-probe': '', viewBox: '0 0 24 24' })

export default defineLiveCases('Chip', [
  {
    name: 'click selects and shows the check',
    vue: () => h(VChip, { selectable: true }, () => '已完结'),
    react: () => <Chip selectable>已完结</Chip>,
    interact: async container => {
      await userEvent.click(chip(container))
    },
    settle: idle,
  },
  {
    name: 'second click deselects and collapses the check',
    vue: () => h(VChip, { selectable: true }, () => '已完结'),
    react: () => <Chip selectable>已完结</Chip>,
    interact: async container => {
      await userEvent.click(chip(container))
      await idle()
      await userEvent.click(chip(container))
    },
    settle: idle,
  },
  {
    name: 'keyboard Space toggles a selected chip off',
    vue: () => h(VChip, { selectable: true, selected: true, tone: 'accent' }, () => '有汉化'),
    react: () => (
      <Chip selectable defaultSelected tone="accent">
        有汉化
      </Chip>
    ),
    interact: async container => {
      chip(container).focus()
      await userEvent.keyboard(' ')
    },
    settle: idle,
  },
  {
    name: 'icon hands over to the check when selected',
    vue: () =>
      h(VChip, { selectable: true, variant: 'outline' }, { default: () => '热门', icon: star }),
    react: () => (
      <Chip selectable variant="outline" icon={<svg data-probe="" viewBox="0 0 24 24" />}>
        热门
      </Chip>
    ),
    interact: async container => {
      await userEvent.click(chip(container))
    },
    settle: idle,
  },
  {
    name: 'disabled chip ignores clicks',
    vue: () => h(VChip, { selectable: true, disabled: true }, () => '未选中'),
    react: () => (
      <Chip selectable disabled>
        未选中
      </Chip>
    ),
    interact: async container => {
      chip(container).dispatchEvent(new MouseEvent('click', { bubbles: true }))
    },
    settle: idle,
  },
  {
    name: 'removing a chip from a list',
    vue: () => h(VueRemovable),
    react: () => <ReactRemovable />,
    interact: async container => {
      await userEvent.click(container.querySelectorAll<HTMLElement>('[data-hn-chip] button')[1]!)
    },
    settle: idle,
  },
  {
    name: 'Backspace on the remove button removes',
    vue: () => h(VueRemovable),
    react: () => <ReactRemovable />,
    interact: async container => {
      container.querySelector<HTMLElement>('[data-hn-chip] button')!.focus()
      await userEvent.keyboard('{Backspace}')
    },
    settle: idle,
  },
  {
    name: 'link chip pressed state settles',
    vue: () => h(VChip, { as: 'a', href: '#chip' }, () => '科幻'),
    react: () => (
      <Chip as="a" href="#chip">
        科幻
      </Chip>
    ),
    interact: async container => {
      await userEvent.click(chip(container))
    },
    settle: idle,
  },
])
