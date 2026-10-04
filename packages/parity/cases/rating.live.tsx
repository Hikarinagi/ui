import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VRating from '@hina-ui/vue/components/rating/Rating.vue'
import { Rating } from '@hina-ui/react/components/rating/Rating'
import { defineLiveCases, frames } from '../src/live'

async function idle() {
  await vi.waitFor(
    () => {
      const running = document.getAnimations().filter(a => a.playState === 'running')
      if (running.length) throw new Error('busy')
    },
    { timeout: 3000, interval: 16 },
  )
  await new Promise(resolve => setTimeout(resolve, 300))
  await frames(4)
}

const radios = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('[role="radio"]'))

async function press(key: string) {
  await userEvent.keyboard(`{${key}>}`)
  await new Promise(resolve => setTimeout(resolve, 60))
  await userEvent.keyboard(`{/${key}}`)
}

export default defineLiveCases('Rating', [
  {
    name: 'mounted half steps hide until needed',
    vue: () => h(VRating, { modelValue: 2.5, step: 0.5, 'aria-label': '评分' }),
    react: () => <Rating defaultValue={2.5} step={0.5} aria-label="评分" />,
    settle: idle,
  },
  {
    name: 'hover previews and click selects',
    vue: () => h(VRating, { modelValue: 2, 'aria-label': '评分' }),
    react: () => <Rating defaultValue={2} aria-label="评分" />,
    interact: async container => {
      await userEvent.hover(radios(container)[3]!)
      await idle()
      await userEvent.click(radios(container)[3]!)
    },
    settle: idle,
  },
  {
    name: 'hovering a half star previews half',
    vue: () => h(VRating, { modelValue: 0, step: 0.5, 'aria-label': '评分' }),
    react: () => <Rating defaultValue={0} step={0.5} aria-label="评分" />,
    interact: async container => {
      await userEvent.hover(radios(container)[4]!)
    },
    settle: idle,
  },
  {
    name: 'clicking the selected star clears',
    vue: () => h(VRating, { modelValue: 3, 'aria-label': '评分' }),
    react: () => <Rating defaultValue={3} aria-label="评分" />,
    interact: async container => {
      await userEvent.click(radios(container)[2]!)
      await userEvent.unhover(container.querySelector('[data-hn-rating]')!)
    },
    settle: idle,
  },
  {
    name: 'arrow keys select on a scaled rating',
    vue: () =>
      h(VRating, {
        modelValue: 2,
        max: 10,
        stars: 5,
        step: 0.5,
        name: 'score',
        'aria-label': '评分',
      }),
    react: () => (
      <Rating defaultValue={2} max={10} stars={5} step={0.5} name="score" aria-label="评分" />
    ),
    interact: async container => {
      radios(container)[1]!.focus()
      await press('ArrowRight')
      await userEvent.keyboard('{End}')
    },
    settle: idle,
  },
  {
    name: 'rtl arrows inside a form',
    vue: () =>
      h('form', [h(VRating, { modelValue: 2, dir: 'rtl', name: 'score', 'aria-label': '评分' })]),
    react: () => (
      <form>
        <Rating defaultValue={2} dir="rtl" name="score" aria-label="评分" />
      </form>
    ),
    interact: async container => {
      radios(container)[1]!.focus()
      await press('ArrowLeft')
    },
    settle: idle,
  },
  {
    name: 'readonly',
    vue: () => h(VRating, { modelValue: 4.3, readonly: true }),
    react: () => <Rating defaultValue={4.3} readonly />,
    settle: idle,
  },
])
