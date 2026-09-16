import { expect, it } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '../../index'

it.each(['', 'learn'])(
  'renders all navigation parts from package exports with state %s',
  async modelValue => {
    const html = await renderToString(
      createSSRApp({
        render: () =>
          h(NavigationMenu, { label: 'Navigation', dir: 'rtl', modelValue }, () => [
            h(NavigationMenuItem, { value: 'learn' }, () => [
              h(NavigationMenuTrigger, {}, () => 'Learn'),
              h(NavigationMenuContent, {}, () =>
                h(NavigationMenuLink, { href: '#start' }, () => 'Start'),
              ),
            ]),
            h(NavigationMenuItem, {}, () =>
              h(NavigationMenuLink, { href: '#about', active: true }, () => 'About'),
            ),
          ]),
      }),
    )
    expect(html).toContain('<nav')
    expect(html).toContain('aria-label="Navigation"')
    expect(html).toContain('dir="rtl"')
    expect(html).toContain('aria-current="page"')
    expect(html).toContain(`aria-expanded="${!!modelValue}"`)
    if (modelValue) expect(html).toContain('href="#start"')
  },
)
