import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VToolbar from '@hina-ui/vue/components/toolbar/Toolbar.vue'
import VToolbarButton from '@hina-ui/vue/components/toolbar/ToolbarButton.vue'
import VToolbarLink from '@hina-ui/vue/components/toolbar/ToolbarLink.vue'
import VToolbarSeparator from '@hina-ui/vue/components/toolbar/ToolbarSeparator.vue'
import VToolbarToggleGroup from '@hina-ui/vue/components/toolbar/ToolbarToggleGroup.vue'
import VToolbarToggleItem from '@hina-ui/vue/components/toolbar/ToolbarToggleItem.vue'
import VTooltipProvider from '@hina-ui/vue/components/tooltip/TooltipProvider.vue'
import { Toolbar } from '@hina-ui/react/components/toolbar/Toolbar'
import { ToolbarButton } from '@hina-ui/react/components/toolbar/ToolbarButton'
import { ToolbarLink } from '@hina-ui/react/components/toolbar/ToolbarLink'
import { ToolbarSeparator } from '@hina-ui/react/components/toolbar/ToolbarSeparator'
import { ToolbarToggleGroup } from '@hina-ui/react/components/toolbar/ToolbarToggleGroup'
import { ToolbarToggleItem } from '@hina-ui/react/components/toolbar/ToolbarToggleItem'
import { TooltipProvider } from '@hina-ui/react/components/tooltip/TooltipProvider'
import { defineLiveCases, frames } from '../src/live'

async function idle() {
  await vi.waitFor(
    () => {
      const running = document.getAnimations().filter(a => a.playState === 'running')
      if (running.length || document.querySelector('[data-pressed]')) throw new Error('busy')
    },
    { timeout: 4000, interval: 16 },
  )
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

interface Setup {
  dir?: 'ltr' | 'rtl'
  orientation?: 'horizontal' | 'vertical'
  loop?: boolean
}

const vueTools =
  (setup: Setup = {}) =>
  () =>
    h('div', [
      h('input', { 'aria-label': 'Before' }),
      h(VToolbar, { label: 'Tools', ...setup }, () => [
        h(VToolbarButton, {}, () => 'First'),
        h(VToolbarButton, { disabled: true }, () => 'Disabled'),
        h(VToolbarToggleGroup, { type: 'multiple' }, () => [
          h(VToolbarToggleItem, { value: 'bold' }, () => 'Bold'),
          h(VToolbarToggleItem, { value: 'italic' }, () => 'Italic'),
        ]),
        h(VToolbarSeparator),
        h(
          VToolbarLink,
          { href: '#help', onClick: (event: Event) => event.preventDefault() },
          () => 'Help',
        ),
      ]),
      h('input', { 'aria-label': 'After' }),
    ])

const reactTools =
  (setup: Setup = {}) =>
  () => (
    <div>
      <input aria-label="Before" />
      <Toolbar label="Tools" {...setup}>
        <ToolbarButton>First</ToolbarButton>
        <ToolbarButton disabled>Disabled</ToolbarButton>
        <ToolbarToggleGroup type="multiple">
          <ToolbarToggleItem value="bold">Bold</ToolbarToggleItem>
          <ToolbarToggleItem value="italic">Italic</ToolbarToggleItem>
        </ToolbarToggleGroup>
        <ToolbarSeparator />
        <ToolbarLink href="#help" onClick={event => event.preventDefault()}>
          Help
        </ToolbarLink>
      </Toolbar>
      <input aria-label="After" />
    </div>
  )

async function enter() {
  ;(document.querySelector('input[aria-label=Before]') as HTMLElement).focus()
  await userEvent.tab()
}

export default defineLiveCases('Toolbar', [
  {
    name: 'mounted toolbar becomes one tab stop',
    vue: vueTools(),
    react: reactTools(),
    settle: idle,
  },
  {
    name: 'Tab enters the first control and arrows skip disabled controls',
    vue: vueTools(),
    react: reactTools(),
    interact: async () => {
      await enter()
      await userEvent.keyboard('{ArrowRight}{ArrowRight}')
    },
    settle: idle,
  },
  {
    name: 'RTL arrows move in visual order and wrap',
    vue: vueTools({ dir: 'rtl' }),
    react: reactTools({ dir: 'rtl' }),
    interact: async () => {
      await enter()
      await userEvent.keyboard('{ArrowRight}')
    },
    settle: idle,
  },
  {
    name: 'vertical toolbar without loop stops at the end',
    vue: vueTools({ orientation: 'vertical', loop: false }),
    react: reactTools({ orientation: 'vertical', loop: false }),
    interact: async () => {
      await enter()
      await userEvent.keyboard('{End}{ArrowDown}{ArrowRight}')
    },
    settle: idle,
  },
  {
    name: 'Space presses toggle items without moving the tab stop',
    vue: vueTools(),
    react: reactTools(),
    interact: async () => {
      await enter()
      await userEvent.keyboard('{ArrowRight}{Space}{ArrowRight}{Space}{Space}')
    },
    settle: idle,
  },
  {
    name: 'Shift+Tab out keeps the toolbar root out of the tab order',
    vue: vueTools(),
    react: reactTools(),
    interact: async () => {
      await enter()
      await userEvent.keyboard('{ArrowRight}')
      await userEvent.tab()
      await userEvent.tab({ shift: true })
      await userEvent.tab({ shift: true })
    },
    settle: idle,
  },
  {
    name: 'Tab forward again re-enters through the root',
    vue: vueTools(),
    react: reactTools(),
    interact: async () => {
      await enter()
      await userEvent.keyboard('{End}')
      await userEvent.tab()
      ;(document.querySelector('input[aria-label=Before]') as HTMLElement).focus()
      await userEvent.tab()
    },
    settle: idle,
  },
  {
    name: 'labelled control shows its tooltip on hover inside a provider',
    vue: () =>
      h(VTooltipProvider, { delayDuration: 0 }, () =>
        h(VToolbar, { label: 'Icons', size: 'sm' }, () => [
          h(VToolbarButton, { label: 'Undo' }, () => '↶'),
          h(VToolbarButton, { label: 'Redo', disabled: true }, () => '↷'),
        ]),
      ),
    react: () => (
      <TooltipProvider delayDuration={0}>
        <Toolbar label="Icons" size="sm">
          <ToolbarButton label="Undo">↶</ToolbarButton>
          <ToolbarButton label="Redo" disabled>
            ↷
          </ToolbarButton>
        </Toolbar>
      </TooltipProvider>
    ),
    interact: async container => {
      await userEvent.hover(container.querySelector('button')!)
    },
    settle: positioned,
  },
])
