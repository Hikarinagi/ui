import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VTabs from '@hina-ui/vue/components/tabs/Tabs.vue'
import VTabsList from '@hina-ui/vue/components/tabs/TabsList.vue'
import VTabsTrigger from '@hina-ui/vue/components/tabs/TabsTrigger.vue'
import VTabsContent from '@hina-ui/vue/components/tabs/TabsContent.vue'
import { Tabs } from '@hina-ui/react/components/tabs/Tabs'
import { TabsList } from '@hina-ui/react/components/tabs/TabsList'
import { TabsTrigger } from '@hina-ui/react/components/tabs/TabsTrigger'
import { TabsContent } from '@hina-ui/react/components/tabs/TabsContent'
import { defineLiveCases, frames } from '../src/live'

async function idle() {
  let last = ''
  let stable = 0
  await vi.waitFor(
    () => {
      const running = document
        .getAnimations()
        .filter(
          a =>
            a.playState === 'running' &&
            !((a.effect as KeyframeEffect | null)?.target as Element | null)?.closest(
              '.os-scrollbar',
            ),
        )
      if (running.length || document.querySelector('[data-pressed]')) throw new Error('busy')
      const highlight = document.querySelector('[data-hn-highlight]')
      const box = highlight ? JSON.stringify(highlight.getBoundingClientRect()) : ''
      const transform = highlight ? (highlight as HTMLElement).style.transform : ''
      const key = `${box}|${transform}`
      stable = key === last ? stable + 1 : 0
      last = key
      if (stable < 10) throw new Error('moving')
    },
    { timeout: 4000, interval: 16 },
  )
  await frames(4)
}

interface Setup {
  variant?: 'underline' | 'soft'
  orientation?: 'horizontal' | 'vertical'
  disabled?: string
}

const values = ['a', 'b', 'c']

const vueHarness = (setup: Setup) => () =>
  h('div', { style: { width: '480px' } }, [
    h(VTabs, { defaultValue: 'a', variant: setup.variant, orientation: setup.orientation }, () => [
      h(VTabsList, { label: '分组' }, () =>
        values.map(value =>
          h(VTabsTrigger, { value, disabled: setup.disabled === value }, () => `页签 ${value}`),
        ),
      ),
      ...values.map(value => h(VTabsContent, { value }, () => h('p', `内容 ${value}`))),
    ]),
  ])

const reactHarness = (setup: Setup) => () => (
  <div style={{ width: '480px' }}>
    <Tabs defaultValue="a" variant={setup.variant} orientation={setup.orientation}>
      <TabsList label="分组">
        {values.map(value => (
          <TabsTrigger key={value} value={value} disabled={setup.disabled === value}>
            {`页签 ${value}`}
          </TabsTrigger>
        ))}
      </TabsList>
      {values.map(value => (
        <TabsContent key={value} value={value}>
          <p>{`内容 ${value}`}</p>
        </TabsContent>
      ))}
    </Tabs>
  </div>
)

const tabs = (container: HTMLElement) => [
  ...container.querySelectorAll<HTMLElement>('[role="tab"]'),
]

const live = (
  name: string,
  setup: Setup,
  interact?: (container: HTMLElement) => Promise<void>,
) => ({ name, vue: vueHarness(setup), react: reactHarness(setup), interact, settle: idle })

export default defineLiveCases('Tabs', [
  live('mounted registers panels and clears the mount animation guard', {}),
  live('click switches the tab and moves the highlight', {}, async container => {
    await userEvent.click(tabs(container)[1]!)
  }),
  live('soft click switches the tab', { variant: 'soft' }, async container => {
    await userEvent.click(tabs(container)[2]!)
  }),
  live('ArrowRight activates the next tab', {}, async container => {
    tabs(container)[0]!.focus()
    await userEvent.keyboard('{ArrowRight}')
  }),
  live('ArrowLeft wraps to the last tab', {}, async container => {
    tabs(container)[0]!.focus()
    await userEvent.keyboard('{ArrowLeft}')
  }),
  live('End then Home', {}, async container => {
    tabs(container)[0]!.focus()
    await userEvent.keyboard('{End}')
    await idle()
    await userEvent.keyboard('{Home}')
  }),
  live('disabled tab is skipped', { disabled: 'b' }, async container => {
    tabs(container)[0]!.focus()
    await userEvent.keyboard('{ArrowRight}')
  }),
  live('vertical ArrowDown follows on y', { orientation: 'vertical' }, async container => {
    tabs(container)[0]!.focus()
    await userEvent.keyboard('{ArrowDown}')
  }),
  live('Tab moves focus into the list and out to the panel', {}, async container => {
    await userEvent.click(tabs(container)[1]!)
    await idle()
    container.ownerDocument.body.focus()
    await userEvent.tab()
    await userEvent.tab()
  }),
])
