import { defineComponent, h, ref, type PropType } from 'vue'
import { useSyncExternalStore } from 'react'
import { vi } from 'vitest'
import VLoadingOverlay from '@hina-ui/vue/components/loading-overlay/LoadingOverlay.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { LoadingOverlay } from '@hina-ui/react/components/loading-overlay/LoadingOverlay'
import { Button } from '@hina-ui/react/components/button/Button'
import { defineLiveCases, frames } from '../src/live'
import { finished, wait } from './dialog.live'

const vueVisible = ref(false)
let reactVisible = false
const listeners = new Set<() => void>()

function setVisible(value: boolean) {
  vueVisible.value = value
  reactVisible = value
  for (const listener of [...listeners]) listener()
}

function useVisible() {
  return useSyncExternalStore(
    listener => {
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    },
    () => reactVisible,
    () => reactVisible,
  )
}

const host = 'relative h-40 w-80 p-10'

function Toggle(props: { delay?: number; minVisible?: number; text?: string }) {
  return (
    <div className={host}>
      <Button variant="outline" tone="neutral">
        按钮
      </Button>
      <LoadingOverlay visible={useVisible()} {...props} />
    </div>
  )
}

const VueToggle = defineComponent({
  props: {
    initial: { type: Boolean, default: false },
    options: { type: Object as PropType<Record<string, unknown>>, default: () => ({}) },
  },
  setup(props) {
    setVisible(props.initial)
    return () =>
      h('div', { class: host }, [
        h(VButton, { variant: 'outline', tone: 'neutral' }, () => '按钮'),
        h(VLoadingOverlay, { visible: vueVisible.value, ...props.options }),
      ])
  },
})

function vueToggle(initial: boolean, options: Record<string, unknown>) {
  return () => h(VueToggle, { initial, options })
}

function reactToggle(initial: boolean, options: Parameters<typeof Toggle>[0]) {
  return () => {
    setVisible(initial)
    return <Toggle {...options} />
  }
}

async function shown() {
  await vi.waitFor(
    () => {
      const overlay = document.querySelector('[data-hn-loading-overlay]')
      if (!overlay || overlay.classList.contains('hn-transition-base')) throw new Error('entering')
    },
    { timeout: 3000 },
  )
  await finished()
  await frames(3)
}

async function gone() {
  await vi.waitFor(
    () => {
      if (document.querySelector('[data-hn-loading-overlay]')) throw new Error('shown')
    },
    { timeout: 3000 },
  )
  await frames(3)
}

export default defineLiveCases('LoadingOverlay', [
  {
    name: 'zero delay fades in with text',
    vue: vueToggle(true, { delay: 0, text: '正在加载' }),
    react: reactToggle(true, { delay: 0, text: '正在加载' }),
    settle: shown,
  },
  {
    name: 'blocker while the delay is pending',
    vue: vueToggle(false, { delay: 1000 }),
    react: reactToggle(false, { delay: 1000 }),
    interact: () => setVisible(true),
    settle: async () => {
      await wait(100)
      await frames()
    },
  },
  {
    name: 'overlay replaces the blocker after the delay',
    vue: vueToggle(false, { delay: 200 }),
    react: reactToggle(false, { delay: 200 }),
    interact: () => setVisible(true),
    settle: shown,
  },
  {
    name: 'hides after the minimum visible time',
    vue: vueToggle(false, { delay: 0, minVisible: 300 }),
    react: reactToggle(false, { delay: 0, minVisible: 300 }),
    interact: async () => {
      setVisible(true)
      await shown()
      setVisible(false)
    },
    settle: gone,
  },
])
