import { h } from 'vue'
import { userEvent } from 'vitest/browser'
import { vi } from 'vitest'
import VNavigationMenu from '@hina-ui/vue/components/navigation-menu/NavigationMenu.vue'
import VNavigationMenuItem from '@hina-ui/vue/components/navigation-menu/NavigationMenuItem.vue'
import VNavigationMenuTrigger from '@hina-ui/vue/components/navigation-menu/NavigationMenuTrigger.vue'
import VNavigationMenuContent from '@hina-ui/vue/components/navigation-menu/NavigationMenuContent.vue'
import VNavigationMenuLink from '@hina-ui/vue/components/navigation-menu/NavigationMenuLink.vue'
import { NavigationMenu } from '@hina-ui/react/components/navigation-menu/NavigationMenu'
import { NavigationMenuItem } from '@hina-ui/react/components/navigation-menu/NavigationMenuItem'
import { NavigationMenuTrigger } from '@hina-ui/react/components/navigation-menu/NavigationMenuTrigger'
import { NavigationMenuContent } from '@hina-ui/react/components/navigation-menu/NavigationMenuContent'
import { NavigationMenuLink } from '@hina-ui/react/components/navigation-menu/NavigationMenuLink'
import { defineLiveCases, frames, type LiveCase } from '../src/live'

async function idle() {
  await vi.waitFor(
    () => {
      const running = document
        .getAnimations()
        .filter(animation => animation.playState === 'running')
      if (running.length) throw new Error('animating')
      const viewport = document.querySelector('[data-hn-navigation-viewport]')
      if (viewport && !viewport.hasAttribute('hidden') && !viewport.hasAttribute('data-hn-ready'))
        throw new Error('measuring')
    },
    { timeout: 4000 },
  )
  await frames(6)
  await vi.waitFor(
    () => {
      if (document.getAnimations().some(animation => animation.playState === 'running'))
        throw new Error('animating')
    },
    { timeout: 4000 },
  )
}

const names = ['one', 'two']

const vueMenu =
  (props: Record<string, unknown> = {}) =>
  () =>
    h('div', { style: 'padding: 40px; min-height: 420px' }, [
      h(VNavigationMenu, { label: 'Navigation', trigger: 'click', ...props }, () => [
        ...names.map((name, index) =>
          h(VNavigationMenuItem, { value: name }, () => [
            h(VNavigationMenuTrigger, {}, () => name),
            h(VNavigationMenuContent, { class: index ? 'w-96' : 'w-72' }, () => [
              h(VNavigationMenuLink, { href: `#${name}-first` }, () => `${name} first`),
              h(
                VNavigationMenuLink,
                { href: `#${name}-last`, description: 'Description' },
                () => `${name} last`,
              ),
            ]),
          ]),
        ),
        h(VNavigationMenuItem, {}, () =>
          h(VNavigationMenuTrigger, { disabled: true }, () => 'disabled'),
        ),
        h(VNavigationMenuItem, {}, () =>
          h(VNavigationMenuLink, { href: '#about', active: true }, () => 'about'),
        ),
      ]),
    ])

const reactMenu =
  (props: Record<string, unknown> = {}) =>
  () => (
    <div style={{ padding: '40px', minHeight: '420px' }}>
      <NavigationMenu label="Navigation" trigger="click" {...props}>
        {names.map((name, index) => (
          <NavigationMenuItem key={name} value={name}>
            <NavigationMenuTrigger>{name}</NavigationMenuTrigger>
            <NavigationMenuContent className={index ? 'w-96' : 'w-72'}>
              <NavigationMenuLink href={`#${name}-first`}>{`${name} first`}</NavigationMenuLink>
              <NavigationMenuLink href={`#${name}-last`} description="Description">
                {`${name} last`}
              </NavigationMenuLink>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
        <NavigationMenuItem>
          <NavigationMenuTrigger disabled>disabled</NavigationMenuTrigger>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink href="#about" active>
            about
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenu>
    </div>
  )

const triggers = (container: HTMLElement) => [
  ...container.querySelectorAll<HTMLElement>('[data-navigation-menu-trigger]'),
]

async function park() {
  const element = document.createElement('div')
  element.style.cssText = 'position: fixed; bottom: 0; right: 0; width: 8px; height: 8px'
  document.body.appendChild(element)
  await userEvent.hover(element)
  element.remove()
}

const live = (
  name: string,
  props: Record<string, unknown>,
  interact?: (container: HTMLElement) => Promise<void>,
  reactProps: Record<string, unknown> = props,
): LiveCase => ({
  name,
  vue: vueMenu(props),
  react: reactMenu(reactProps),
  interact: async container => {
    await park()
    await interact?.(container)
  },
  settle: idle,
})

export default defineLiveCases('NavigationMenu', [
  live('closed after mount with measured layout', {}),
  live('controlled open panel after mount', { modelValue: 'one' }, undefined, { value: 'one' }),
  live('opens the first panel on click', {}, async container => {
    await userEvent.click(triggers(container)[0]!)
  }),
  live('switches to a wider panel and resizes the viewport', {}, async container => {
    await userEvent.click(triggers(container)[0]!)
    await idle()
    await userEvent.click(triggers(container)[1]!)
  }),
  live('closes again on a second click', {}, async container => {
    await userEvent.click(triggers(container)[0]!)
    await idle()
    await userEvent.click(triggers(container)[0]!)
  }),
  ...(['ltr', 'rtl'] as const).flatMap(dir =>
    (['start', 'center', 'end'] as const).map(align =>
      live(
        `vertical ${dir} panel aligned ${align}`,
        { orientation: 'vertical', dir, align },
        async container => {
          await userEvent.click(triggers(container)[1]!)
        },
      ),
    ),
  ),
  live('horizontal rtl panel aligned start', { dir: 'rtl', align: 'start' }, async container => {
    await userEvent.click(triggers(container)[0]!)
  }),
  live('keyboard opens and enters the panel', {}, async container => {
    triggers(container)[0]!.focus()
    await userEvent.keyboard('{Enter}')
    await idle()
    await userEvent.keyboard('{ArrowDown}')
  }),
  live('keyboard moves between top-level controls', {}, async container => {
    triggers(container)[0]!.focus()
    await userEvent.keyboard('{ArrowRight}{ArrowRight}')
  }),
  live('escape closes the panel and returns focus', {}, async container => {
    triggers(container)[0]!.focus()
    await userEvent.keyboard('{Enter}')
    await idle()
    await userEvent.keyboard('{ArrowDown}')
    await userEvent.keyboard('{Escape}')
  }),
  live('tabbing through the focus proxy into the panel', {}, async container => {
    await userEvent.click(triggers(container)[0]!)
    await idle()
    triggers(container)[0]!.focus()
    await userEvent.tab()
  }),
  live('hover opens with no delay', { trigger: 'hover', delayDuration: 0 }, async container => {
    await userEvent.hover(triggers(container)[0]!)
  }),
  live(
    'hover moves from the trigger into the panel',
    { trigger: 'hover', delayDuration: 0 },
    async container => {
      await userEvent.hover(triggers(container)[0]!)
      await idle()
      await userEvent.hover(container.querySelector('[data-hn-navigation-content] a')!)
    },
  ),
  live('selecting a panel link dismisses the menu', {}, async container => {
    await userEvent.click(triggers(container)[0]!)
    await idle()
    const link = container.querySelector<HTMLElement>('[data-hn-navigation-content] a')!
    link.addEventListener('click', event => event.preventDefault())
    await userEvent.click(link)
  }),
  live('kept mounted panels while open', { unmountOnHide: false }, async container => {
    await userEvent.click(triggers(container)[1]!)
  }),
  live('kept mounted panels after closing', { unmountOnHide: false }, async container => {
    await userEvent.click(triggers(container)[0]!)
    await idle()
    await userEvent.click(triggers(container)[0]!)
  }),
  ...(['sm', 'lg'] as const).map(size =>
    live(`${size} panel open`, { size }, async container => {
      await userEvent.click(triggers(container)[0]!)
    }),
  ),
])
