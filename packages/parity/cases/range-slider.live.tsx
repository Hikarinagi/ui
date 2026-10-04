import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VRangeSlider from '@hina-ui/vue/components/range-slider/RangeSlider.vue'
import VTooltipProvider from '@hina-ui/vue/components/tooltip/TooltipProvider.vue'
import { RangeSlider } from '@hina-ui/react/components/range-slider/RangeSlider'
import { TooltipProvider } from '@hina-ui/react/components/tooltip/TooltipProvider'
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

async function positioned() {
  await vi.waitFor(() => {
    const wrappers = document.querySelectorAll<HTMLElement>(
      '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]',
    )
    if (!wrappers.length || [...wrappers].some(w => w.style.transform.includes('-200%')))
      throw new Error('not positioned')
  })
  await idle()
}

const marks = [{ value: 0, label: '低' }, { value: 50 }, { value: 100, label: '高' }]
const host = { style: { width: '360px', padding: '40px' } }
const thumbs = (container: HTMLElement) =>
  Array.from(container.querySelectorAll<HTMLElement>('[role="slider"]'))
const track = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[data-hn-range-slider]')!.firstElementChild as HTMLElement

export default defineLiveCases('RangeSlider', [
  {
    name: 'mounted thumbs and fill',
    vue: () =>
      h('div', host, [h(VRangeSlider, { modelValue: [20, 60], marks, 'aria-label': '区间' })]),
    react: () => (
      <div {...host}>
        <RangeSlider defaultValue={[20, 60]} marks={marks} aria-label="区间" />
      </div>
    ),
    settle: idle,
  },
  {
    name: 'tab walks both thumbs and each shows its label',
    vue: () =>
      h(VTooltipProvider, null, () =>
        h('div', host, [h(VRangeSlider, { modelValue: [25, 75], step: 5, 'aria-label': '区间' })]),
      ),
    react: () => (
      <TooltipProvider>
        <div {...host}>
          <RangeSlider defaultValue={[25, 75]} step={5} aria-label="区间" />
        </div>
      </TooltipProvider>
    ),
    interact: async container => {
      const before = document.createElement('button')
      container.prepend(before)
      before.focus()
      await userEvent.keyboard('{Tab}{ArrowRight}{Tab}{ArrowLeft}')
      before.remove()
    },
    settle: positioned,
  },
  {
    name: 'clicking the track moves the closest thumb',
    vue: () => h('div', host, [h(VRangeSlider, { modelValue: [20, 40], label: 'none', step: 10 })]),
    react: () => (
      <div {...host}>
        <RangeSlider defaultValue={[20, 40]} label="none" step={10} />
      </div>
    ),
    interact: async container => {
      const r = track(container).getBoundingClientRect()
      await userEvent.click(track(container), { position: { x: r.width * 0.9, y: r.height / 2 } })
    },
    settle: idle,
  },
  {
    name: 'min steps keep the thumbs apart',
    vue: () =>
      h('div', host, [
        h(VRangeSlider, { modelValue: [20, 60], step: 10, minSteps: 2, label: 'none' }),
      ]),
    react: () => (
      <div {...host}>
        <RangeSlider defaultValue={[20, 60]} step={10} minSteps={2} label="none" />
      </div>
    ),
    interact: async container => {
      thumbs(container)[1]!.focus()
      await userEvent.keyboard('{ArrowLeft}{ArrowLeft}{ArrowLeft}')
    },
    settle: idle,
  },
  {
    name: 'rtl range',
    vue: () =>
      h('div', host, [
        h(VRangeSlider, { modelValue: [25, 60], dir: 'rtl', marks, label: 'none', step: 5 }),
      ]),
    react: () => (
      <div {...host}>
        <RangeSlider defaultValue={[25, 60]} dir="rtl" marks={marks} label="none" step={5} />
      </div>
    ),
    interact: async container => {
      thumbs(container)[0]!.focus()
      await userEvent.keyboard('{ArrowRight}')
    },
    settle: idle,
  },
])
