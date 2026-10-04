import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h } from 'vue'
import NavigationMenu from './NavigationMenu.vue'
import NavigationMenuItem from './NavigationMenuItem.vue'
import NavigationMenuTrigger from './NavigationMenuTrigger.vue'
import NavigationMenuContent from './NavigationMenuContent.vue'
import NavigationMenuLink from './NavigationMenuLink.vue'
import '../../../test/browser.css'

const wrappers: VueWrapper[] = []

afterEach(() => {
  for (const wrapper of wrappers.splice(0)) wrapper.unmount()
})

describe('NavigationMenuContent dismiss', () => {
  it('calls onDismiss when the open content is dismissed with Escape', async () => {
    const onDismiss = vi.fn()
    const wrapper = mount(
      () =>
        h(NavigationMenu, { label: 'Navigation', trigger: 'click' }, () =>
          h(NavigationMenuItem, { value: 'one' }, () => [
            h(NavigationMenuTrigger, null, () => 'One'),
            h(NavigationMenuContent, { onDismiss }, () =>
              h(NavigationMenuLink, { href: '#one' }, () => 'First'),
            ),
          ]),
        ),
      { attachTo: document.body },
    )
    wrappers.push(wrapper)
    await userEvent.click(document.querySelector('button')!)
    await vi.waitFor(() => expect(document.querySelector('a[href="#one"]')).not.toBeNull())
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1))
  })
})
