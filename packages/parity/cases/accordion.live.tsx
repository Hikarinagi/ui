import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VAccordion from '@hina-ui/vue/components/accordion/Accordion.vue'
import VAccordionItem from '@hina-ui/vue/components/accordion/AccordionItem.vue'
import VAccordionTrigger from '@hina-ui/vue/components/accordion/AccordionTrigger.vue'
import VAccordionContent from '@hina-ui/vue/components/accordion/AccordionContent.vue'
import { Accordion } from '@hina-ui/react/components/accordion/Accordion'
import { AccordionItem } from '@hina-ui/react/components/accordion/AccordionItem'
import { AccordionTrigger } from '@hina-ui/react/components/accordion/AccordionTrigger'
import { AccordionContent } from '@hina-ui/react/components/accordion/AccordionContent'
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

const values = ['a', 'b', 'c']

const vueHarness =
  ({ lastDisabled, ...props }: Record<string, unknown> = {}) =>
  () =>
    h(VAccordion, props, () =>
      values.map(value =>
        h(VAccordionItem, { value, disabled: value === 'c' && lastDisabled === true }, () => [
          h(VAccordionTrigger, () => `标题 ${value}`),
          h(VAccordionContent, () => h('p', { style: { height: '48px' } }, `内容 ${value}`)),
        ]),
      ),
    )

const reactHarness =
  ({ lastDisabled, ...props }: Record<string, unknown> = {}) =>
  () => (
    <Accordion {...props}>
      {values.map(value => (
        <AccordionItem key={value} value={value} disabled={value === 'c' && lastDisabled === true}>
          <AccordionTrigger>{`标题 ${value}`}</AccordionTrigger>
          <AccordionContent>
            <p style={{ height: '48px' }}>{`内容 ${value}`}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )

const buttons = (container: HTMLElement) => [...container.querySelectorAll('button')]

const live = (
  name: string,
  props: Record<string, unknown>,
  interact?: (container: HTMLElement) => Promise<void>,
) => ({ name, vue: vueHarness(props), react: reactHarness(props), interact, settle: idle })

export default defineLiveCases('Accordion', [
  live('closed by default', {}),
  live('defaultValue opens on mount', { defaultValue: 'b' }),
  live('click opens an item', {}, async container => {
    await userEvent.click(buttons(container)[0]!)
  }),
  live('opening another item closes the previous one', {}, async container => {
    await userEvent.click(buttons(container)[0]!)
    await idle()
    await userEvent.click(buttons(container)[1]!)
  }),
  live('single non-collapsible keeps the open item', { defaultValue: 'a' }, async container => {
    await userEvent.click(buttons(container)[0]!)
  }),
  live(
    'collapsible closes the open item',
    { collapsible: true, defaultValue: 'a' },
    async container => {
      await userEvent.click(buttons(container)[0]!)
    },
  ),
  live('multiple keeps several open', { type: 'multiple' }, async container => {
    await userEvent.click(buttons(container)[0]!)
    await idle()
    await userEvent.click(buttons(container)[2]!)
  }),
  live('arrow keys then Enter open the focused item', {}, async container => {
    buttons(container)[0]!.focus()
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Enter}')
  }),
  live('End skips nothing and Home wraps to the first', { lastDisabled: true }, async container => {
    buttons(container)[1]!.focus()
    await userEvent.keyboard('{End}')
    await userEvent.keyboard('{Home}')
    await userEvent.keyboard('{Enter}')
  }),
  live('disabled root ignores clicks', { disabled: true }, async container => {
    buttons(container)[0]!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  }),
])
