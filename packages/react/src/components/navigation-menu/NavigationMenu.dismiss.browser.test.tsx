import { afterEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render, type RenderResult } from 'vitest-browser-react'
import { NavigationMenu } from './NavigationMenu'
import { NavigationMenuItem } from './NavigationMenuItem'
import { NavigationMenuTrigger } from './NavigationMenuTrigger'
import { NavigationMenuContent } from './NavigationMenuContent'
import { NavigationMenuLink } from './NavigationMenuLink'
import '../../../test/browser.css'

const wrappers: RenderResult[] = []

afterEach(async () => {
  for (const wrapper of wrappers.splice(0)) await wrapper.unmount()
})

describe('NavigationMenuContent dismiss', () => {
  it('calls onDismiss when the open content is dismissed with Escape', async () => {
    const onDismiss = vi.fn()
    const wrapper = await render(
      <NavigationMenu label="Navigation" trigger="click">
        <NavigationMenuItem value="one">
          <NavigationMenuTrigger>One</NavigationMenuTrigger>
          <NavigationMenuContent onDismiss={onDismiss}>
            <NavigationMenuLink href="#one">First</NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenu>,
    )
    wrappers.push(wrapper)
    await userEvent.click(document.querySelector('button')!)
    await vi.waitFor(() => expect(document.querySelector('a[href="#one"]')).not.toBeNull())
    await userEvent.keyboard('{Escape}')
    await vi.waitFor(() => expect(onDismiss).toHaveBeenCalledTimes(1))
  })
})
