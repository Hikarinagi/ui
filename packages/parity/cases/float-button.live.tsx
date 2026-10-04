import { defineComponent, h, ref } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import { useState } from 'react'
import { Plus } from '@hina-ui/vue/../node_modules/@lucide/vue'
import { Plus as ReactPlus } from '@hina-ui/react/../node_modules/lucide-react'
import VFloatButton from '@hina-ui/vue/components/float-button/FloatButton.vue'
import VTooltipProvider from '@hina-ui/vue/components/tooltip/TooltipProvider.vue'
import { FloatButton } from '@hina-ui/react/components/float-button/FloatButton'
import { TooltipProvider } from '@hina-ui/react/components/tooltip/TooltipProvider'
import { lucide } from '@hina-ui/react/lib/icon'
import { defineLiveCases, frames } from '../src/live'

const PlusIcon = lucide(ReactPlus)

async function positioned() {
  await vi.waitFor(() => {
    const wrapper = document.querySelector<HTMLElement>(
      '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]',
    )
    if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
  })
  await frames()
}

async function settled() {
  await vi.waitFor(() => {
    if (document.querySelector('[class*="hn-transition-base"], .pointer-events-none[inert]'))
      throw new Error('transition running')
  })
  await frames()
}

const VToggle = defineComponent({
  props: { initial: Boolean, provider: Boolean },
  setup(props) {
    const visible = ref(props.initial)
    const button = () =>
      h(
        VFloatButton,
        { label: '同步资料', position: 'static', visible: visible.value },
        { default: () => h(Plus) },
      )
    return () =>
      h('div', [
        h(
          'button',
          { type: 'button', id: 'toggle', onClick: () => (visible.value = !visible.value) },
          'toggle',
        ),
        props.provider ? h(VTooltipProvider, { delayDuration: 0 }, button) : button(),
      ])
  },
})

function Toggle({ initial, provider }: { initial: boolean; provider: boolean }) {
  const [visible, setVisible] = useState(initial)
  const button = (
    <FloatButton label="同步资料" position="static" visible={visible}>
      <PlusIcon />
    </FloatButton>
  )
  return (
    <div>
      <button type="button" id="toggle" onClick={() => setVisible(value => !value)}>
        toggle
      </button>
      {provider ? <TooltipProvider delayDuration={0}>{button}</TooltipProvider> : button}
    </div>
  )
}

const toggle = (container: HTMLElement) => container.querySelector<HTMLElement>('#toggle')!.click()

export default defineLiveCases('FloatButton', [
  {
    name: 'mounted inside a provider marks the grace-area trigger',
    vue: () =>
      h(VTooltipProvider, { delayDuration: 0 }, () =>
        h(VFloatButton, { label: '新建项目', position: 'static' }, { default: () => h(Plus) }),
      ),
    react: () => (
      <TooltipProvider delayDuration={0}>
        <FloatButton label="新建项目" position="static">
          <PlusIcon />
        </FloatButton>
      </TooltipProvider>
    ),
    settle: () => frames(),
  },
  {
    name: 'mounted without a provider',
    vue: () =>
      h(
        VFloatButton,
        { label: '新建项目', position: 'absolute', offset: 16 },
        { default: () => h(Plus) },
      ),
    react: () => (
      <FloatButton label="新建项目" position="absolute" offset={16}>
        <PlusIcon />
      </FloatButton>
    ),
    settle: () => frames(),
  },
  {
    name: 'hover shows the label tooltip and describes the button',
    vue: () =>
      h(VTooltipProvider, { delayDuration: 0 }, () =>
        h(
          VFloatButton,
          { label: '新建项目', position: 'static', tooltipSide: 'left' },
          { default: () => h(Plus) },
        ),
      ),
    react: () => (
      <TooltipProvider delayDuration={0}>
        <FloatButton label="新建项目" position="static" tooltipSide="left">
          <PlusIcon />
        </FloatButton>
      </TooltipProvider>
    ),
    interact: async container => {
      await userEvent.hover(container.querySelector('button')!)
    },
    settle: positioned,
  },
  {
    name: 'extended button never shows a tooltip',
    vue: () =>
      h(VTooltipProvider, { delayDuration: 0 }, () =>
        h(
          VFloatButton,
          { label: '新建项目', position: 'static', extended: true },
          { default: () => h(Plus) },
        ),
      ),
    react: () => (
      <TooltipProvider delayDuration={0}>
        <FloatButton label="新建项目" position="static" extended>
          <PlusIcon />
        </FloatButton>
      </TooltipProvider>
    ),
    interact: async container => {
      await userEvent.hover(container.querySelector('[data-hn-float-button]')!)
      await new Promise(resolve => setTimeout(resolve, 100))
    },
    settle: () => frames(),
  },
  {
    name: 'enters after becoming visible',
    vue: () => h(VToggle, { initial: false, provider: true }),
    react: () => <Toggle initial={false} provider />,
    interact: toggle,
    settle: settled,
  },
  {
    name: 'leaves after becoming hidden',
    vue: () => h(VToggle, { initial: true, provider: false }),
    react: () => <Toggle initial provider={false} />,
    interact: async container => {
      toggle(container)
      await vi.waitFor(() => {
        if (container.querySelector('[data-hn-float-button]')) throw new Error('still leaving')
      })
    },
    settle: () => frames(),
  },
])
