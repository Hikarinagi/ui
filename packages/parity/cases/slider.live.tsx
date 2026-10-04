import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VSlider from '@hina-ui/vue/components/slider/Slider.vue'
import VTooltipProvider from '@hina-ui/vue/components/tooltip/TooltipProvider.vue'
import VFormField from '@hina-ui/vue/components/form-field/FormField.vue'
import { Slider } from '@hina-ui/react/components/slider/Slider'
import { TooltipProvider } from '@hina-ui/react/components/tooltip/TooltipProvider'
import { FormField } from '@hina-ui/react/components/form-field/FormField'
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
    const wrapper = document.querySelector<HTMLElement>(
      '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]',
    )
    if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
  })
  await idle()
}

const marks = [{ value: 0, label: '慢' }, { value: 50 }, { value: 100, label: '快' }]
const host = { style: { width: '360px', padding: '40px' } }
const thumb = (container: HTMLElement) => container.querySelector<HTMLElement>('[role="slider"]')!
const track = (container: HTMLElement) =>
  container.querySelector<HTMLElement>('[data-hn-slider], [data-hn-range-slider]')!
    .firstElementChild as HTMLElement

export default defineLiveCases('Slider', [
  {
    name: 'mounted thumb position and value',
    vue: () => h('div', host, [h(VSlider, { modelValue: 30, marks, 'aria-label': '音量' })]),
    react: () => (
      <div {...host}>
        <Slider defaultValue={30} marks={marks} aria-label="音量" />
      </div>
    ),
    settle: idle,
  },
  {
    name: 'hovering opens the value label',
    vue: () =>
      h(VTooltipProvider, null, () =>
        h('div', host, [h(VSlider, { modelValue: 50, 'aria-label': '音量' })]),
      ),
    react: () => (
      <TooltipProvider>
        <div {...host}>
          <Slider defaultValue={50} aria-label="音量" />
        </div>
      </TooltipProvider>
    ),
    interact: async container => {
      await userEvent.hover(container.querySelector('[data-hn-slider]')!)
    },
    settle: positioned,
  },
  {
    name: 'keyboard focus rings the thumb and steps the value',
    vue: () =>
      h(VTooltipProvider, null, () =>
        h('div', host, [h(VSlider, { modelValue: 50, step: 5, 'aria-label': '音量' })]),
      ),
    react: () => (
      <TooltipProvider>
        <div {...host}>
          <Slider defaultValue={50} step={5} aria-label="音量" />
        </div>
      </TooltipProvider>
    ),
    interact: async container => {
      const before = document.createElement('button')
      container.prepend(before)
      before.focus()
      await userEvent.keyboard('{Tab}')
      await userEvent.keyboard('{ArrowRight}{ArrowRight}{PageDown}')
      before.remove()
    },
    settle: positioned,
  },
  {
    name: 'clicking the track jumps without a ring',
    vue: () =>
      h('div', host, [
        h(VSlider, { modelValue: 50, step: 10, label: 'none', 'aria-label': '音量' }),
      ]),
    react: () => (
      <div {...host}>
        <Slider defaultValue={50} step={10} label="none" aria-label="音量" />
      </div>
    ),
    interact: async container => {
      const r = track(container).getBoundingClientRect()
      await userEvent.click(track(container), { position: { x: r.width * 0.8, y: r.height / 2 } })
    },
    settle: idle,
  },
  {
    name: 'dragging the thumb',
    vue: () =>
      h('div', host, [h(VSlider, { modelValue: 20, label: 'none', 'aria-label': '音量' })]),
    react: () => (
      <div {...host}>
        <Slider defaultValue={20} label="none" aria-label="音量" />
      </div>
    ),
    interact: async container => {
      const t = thumb(container)
      const r = track(container).getBoundingClientRect()
      const start = t.getBoundingClientRect()
      const y = start.top + start.height / 2
      t.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          pointerId: 1,
          clientX: start.left + start.width / 2,
          clientY: y,
          isPrimary: true,
          button: 0,
        }),
      )
      t.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          pointerId: 1,
          clientX: r.left + r.width * 0.6,
          clientY: y,
        }),
      )
      await frames(2)
      t.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          pointerId: 1,
          clientX: r.left + r.width * 0.6,
          clientY: y,
        }),
      )
    },
    settle: idle,
  },
  {
    name: 'rtl keyboard and labels',
    vue: () =>
      h('div', host, [
        h(VSlider, { modelValue: 25, dir: 'rtl', marks, label: 'none', 'aria-label': '音量' }),
      ]),
    react: () => (
      <div {...host}>
        <Slider defaultValue={25} dir="rtl" marks={marks} label="none" aria-label="音量" />
      </div>
    ),
    interact: async container => {
      thumb(container).focus()
      await userEvent.keyboard('{ArrowLeft}{Home}{ArrowLeft}')
    },
    settle: idle,
  },
  {
    name: 'inherited rtl from the document',
    vue: () => h('div', { ...host, dir: 'rtl' }, [h(VSlider, { modelValue: 70, label: 'none' })]),
    react: () => (
      <div {...host} dir="rtl">
        <Slider defaultValue={70} label="none" />
      </div>
    ),
    settle: idle,
  },
  {
    name: 'always-open format label inside a field',
    vue: () =>
      h(VTooltipProvider, null, () =>
        h('div', host, [
          h(VFormField, { label: '音量', description: '0 到 100' }, () =>
            h(VSlider, { modelValue: 40, label: 'always', format: (v: number) => `${v}%` }),
          ),
        ]),
      ),
    react: () => (
      <TooltipProvider>
        <div {...host}>
          <FormField label="音量" description="0 到 100">
            <Slider defaultValue={40} label="always" format={v => `${v}%`} />
          </FormField>
        </div>
      </TooltipProvider>
    ),
    settle: positioned,
  },
  {
    name: 'disabled ignores hover and keys',
    vue: () =>
      h(VTooltipProvider, null, () =>
        h('div', host, [h(VSlider, { modelValue: 40, disabled: true, 'aria-label': '音量' })]),
      ),
    react: () => (
      <TooltipProvider>
        <div {...host}>
          <Slider defaultValue={40} disabled aria-label="音量" />
        </div>
      </TooltipProvider>
    ),
    interact: async container => {
      await userEvent.hover(container.querySelector('[data-hn-slider]')!)
    },
    settle: idle,
  },
])
