import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VCollapsible from '@hina-ui/vue/components/collapsible/Collapsible.vue'
import VCollapsibleTrigger from '@hina-ui/vue/components/collapsible/CollapsibleTrigger.vue'
import VCollapsibleContent from '@hina-ui/vue/components/collapsible/CollapsibleContent.vue'
import VButton from '@hina-ui/vue/components/button/Button.vue'
import { Collapsible } from '@hina-ui/react/components/collapsible/Collapsible'
import { CollapsibleTrigger } from '@hina-ui/react/components/collapsible/CollapsibleTrigger'
import { CollapsibleContent } from '@hina-ui/react/components/collapsible/CollapsibleContent'
import { Button } from '@hina-ui/react/components/button/Button'
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

const stack = { display: 'flex', flexDirection: 'column', rowGap: '8px' } as const

const vueHarness =
  (props: Record<string, unknown> = {}) =>
  () =>
    h(VCollapsible, props, () =>
      h('div', { style: stack }, [
        h(VCollapsibleTrigger, () => '展开'),
        h(VCollapsibleContent, () => h('p', { style: { height: '60px' } }, '折叠内容')),
      ]),
    )

const reactHarness =
  (props: Record<string, unknown> = {}) =>
  () => (
    <Collapsible {...props}>
      <div style={stack}>
        <CollapsibleTrigger>展开</CollapsibleTrigger>
        <CollapsibleContent>
          <p style={{ height: '60px' }}>折叠内容</p>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )

const trigger = (container: HTMLElement) => container.querySelector('button')!

export default defineLiveCases('Collapsible', [
  {
    name: 'closed by default',
    vue: vueHarness(),
    react: reactHarness(),
    settle: idle,
  },
  {
    name: 'defaultOpen keeps the mount animation suppressed',
    vue: vueHarness({ defaultOpen: true }),
    react: reactHarness({ defaultOpen: true }),
    settle: idle,
  },
  {
    name: 'click expands and measures the content',
    vue: vueHarness(),
    react: reactHarness(),
    interact: async container => {
      await userEvent.click(trigger(container))
    },
    settle: idle,
  },
  {
    name: 'click twice collapses again',
    vue: vueHarness(),
    react: reactHarness(),
    interact: async container => {
      await userEvent.click(trigger(container))
      await idle()
      await userEvent.click(trigger(container))
    },
    settle: idle,
  },
  {
    name: 'defaultOpen then collapse',
    vue: vueHarness({ defaultOpen: true }),
    react: reactHarness({ defaultOpen: true }),
    interact: async container => {
      await userEvent.click(trigger(container))
    },
    settle: idle,
  },
  {
    name: 'keyboard Enter toggles',
    vue: vueHarness(),
    react: reactHarness(),
    interact: async container => {
      trigger(container).focus()
      await userEvent.keyboard('{Enter}')
    },
    settle: idle,
  },
  {
    name: 'disabled ignores clicks',
    vue: vueHarness({ disabled: true }),
    react: reactHarness({ disabled: true }),
    interact: async container => {
      trigger(container).dispatchEvent(new MouseEvent('click', { bubbles: true }))
    },
    settle: idle,
  },
  {
    name: 'asChild Button expands',
    vue: () =>
      h(VCollapsible, () => [
        h(VCollapsibleTrigger, { asChild: true }, () =>
          h(VButton, { variant: 'outline', tone: 'neutral' }, () => '借体开关'),
        ),
        h(VCollapsibleContent, () => h('p', '内容')),
      ]),
    react: () => (
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="outline" tone="neutral">
            借体开关
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p>内容</p>
        </CollapsibleContent>
      </Collapsible>
    ),
    interact: async container => {
      await userEvent.click(trigger(container))
    },
    settle: idle,
  },
])
