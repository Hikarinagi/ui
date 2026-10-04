import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VTooltip from '@hina-ui/vue/components/tooltip/Tooltip.vue'
import VTooltipProvider from '@hina-ui/vue/components/tooltip/TooltipProvider.vue'
import VIconButton from '@hina-ui/vue/components/icon-button/IconButton.vue'
import { Tooltip } from '@hina-ui/react/components/tooltip/Tooltip'
import { TooltipProvider } from '@hina-ui/react/components/tooltip/TooltipProvider'
import { IconButton } from '@hina-ui/react/components/icon-button/IconButton'
import { defineLiveCases, frames } from '../src/live'

async function positioned() {
  await vi.waitFor(() => {
    const wrapper = document.querySelector<HTMLElement>(
      '[data-reka-popper-content-wrapper],[data-radix-popper-content-wrapper]',
    )
    if (!wrapper || wrapper.style.transform.includes('-200%')) throw new Error('not positioned')
  })
  await frames()
}

async function closed() {
  await frames()
}

const trigger = () => h('button', { type: 'button' }, 'Trigger')

export default defineLiveCases('Tooltip', [
  {
    name: 'closed by default',
    vue: () => h(VTooltipProvider, null, () => h(VTooltip, { content: 'Save' }, trigger)),
    react: () => (
      <TooltipProvider>
        <Tooltip content="Save">
          <button type="button">Trigger</button>
        </Tooltip>
      </TooltipProvider>
    ),
    settle: closed,
  },
  {
    name: 'controlled open with content prop',
    vue: () =>
      h(VTooltipProvider, null, () => h(VTooltip, { content: 'Save', open: true }, trigger)),
    react: () => (
      <TooltipProvider>
        <Tooltip content="Save" open>
          <button type="button">Trigger</button>
        </Tooltip>
      </TooltipProvider>
    ),
    settle: positioned,
  },
  {
    name: 'placement and class',
    vue: () =>
      h(VTooltipProvider, null, () =>
        h(
          VTooltip,
          {
            content: 'Below',
            open: true,
            side: 'bottom',
            align: 'start',
            sideOffset: 4,
            class: 'max-w-40',
          },
          trigger,
        ),
      ),
    react: () => (
      <TooltipProvider>
        <Tooltip
          content="Below"
          open
          side="bottom"
          align="start"
          sideOffset={4}
          className="max-w-40"
        >
          <button type="button">Trigger</button>
        </Tooltip>
      </TooltipProvider>
    ),
    settle: positioned,
  },
  {
    name: 'rich content',
    vue: () =>
      h(VTooltipProvider, null, () =>
        h(
          VTooltip,
          { open: true },
          { default: trigger, content: () => [h('strong', 'Bold'), ' text'] },
        ),
      ),
    react: () => (
      <TooltipProvider>
        <Tooltip
          open
          content={
            <>
              <strong>Bold</strong> text
            </>
          }
        >
          <button type="button">Trigger</button>
        </Tooltip>
      </TooltipProvider>
    ),
    settle: positioned,
  },
  {
    name: 'keyboard focus opens',
    vue: () => h(VTooltipProvider, null, () => h(VTooltip, { content: 'Focus' }, trigger)),
    react: () => (
      <TooltipProvider>
        <Tooltip content="Focus">
          <button type="button">Trigger</button>
        </Tooltip>
      </TooltipProvider>
    ),
    interact: async () => {
      await userEvent.tab()
    },
    settle: positioned,
  },
  {
    name: 'IconButton without a provider renders no tooltip',
    vue: () => h(VIconButton, { label: 'Close' }, () => h('svg')),
    react: () => (
      <IconButton label="Close">
        <svg />
      </IconButton>
    ),
    settle: closed,
  },
  {
    name: 'IconButton hover shows its label after the provider delay',
    vue: () => h(VTooltipProvider, null, () => h(VIconButton, { label: 'Close' }, () => h('svg'))),
    react: () => (
      <TooltipProvider>
        <IconButton label="Close">
          <svg />
        </IconButton>
      </TooltipProvider>
    ),
    interact: async container => {
      await userEvent.hover(container.querySelector('button')!)
    },
    settle: positioned,
  },
])
