import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import NavigationMenu from './NavigationMenu.vue'
import NavigationMenuItem from './NavigationMenuItem.vue'
import NavigationMenuTrigger from './NavigationMenuTrigger.vue'
import NavigationMenuContent from './NavigationMenuContent.vue'
import NavigationMenuLink from './NavigationMenuLink.vue'
import { expectNoA11yViolations } from '../../../test/axe'

const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

function setup(props = {}) {
  const wrapper = mount(NavigationMenu, {
    props: { label: 'Navigation', trigger: 'click', ...props },
    attachTo: document.body,
    slots: {
      default: () => [
        h(NavigationMenuItem, { value: 'learn' }, () => [
          h(NavigationMenuTrigger, {}, () => 'Learn'),
          h(NavigationMenuContent, {}, () =>
            h(
              NavigationMenuLink,
              { href: '#start', description: 'Start here' },
              () => 'Introduction',
            ),
          ),
        ]),
        h(NavigationMenuItem, {}, () =>
          h(NavigationMenuLink, { href: '#about', active: true }, () => 'About'),
        ),
        h(NavigationMenuItem, {}, () =>
          h(NavigationMenuTrigger, { disabled: true }, () => 'Disabled'),
        ),
      ],
    },
  })
  wrappers.push(wrapper)
  return wrapper
}

describe('NavigationMenu', () => {
  it('renders a named navigation landmark with list items, links and safe trigger buttons', () => {
    const wrapper = setup()
    expect(wrapper.element.tagName).toBe('NAV')
    expect(wrapper.attributes('aria-label')).toBe('Navigation')
    expect(wrapper.findAll('ul > li')).toHaveLength(3)
    expect(wrapper.find('button').attributes('type')).toBe('button')
    expect(wrapper.find('a').attributes('href')).toBe('#about')
    expect(wrapper.find('a').attributes('aria-current')).toBe('page')
    expect(wrapper.find('[role=menu]').exists()).toBe(false)
  })

  it('opens the content, associates it with the trigger and toggles the model', async () => {
    const wrapper = setup()
    await wrapper.find('button').trigger('click')
    await vi.waitFor(() =>
      expect(document.querySelector('[data-hn-navigation-content]')).not.toBeNull(),
    )
    const trigger = wrapper.find('button')
    expect(trigger.attributes('aria-expanded')).toBe('true')
    const content = document.querySelector('[data-hn-navigation-content]')!
    expect(content.id).toBe(trigger.attributes('aria-controls'))
    expect(content.getAttribute('aria-labelledby')).toBe(trigger.attributes('id'))
    expect(content.textContent).toContain('Start here')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['learn'])
    await trigger.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[1]).toEqual([''])
  })

  it('responds to controlled state and closes after selecting a content link', async () => {
    const wrapper = setup({ modelValue: 'learn' })
    await vi.waitFor(() => expect(document.querySelector('a[href="#start"]')).not.toBeNull())
    ;(document.querySelector('a[href="#start"]') as HTMLElement).click()
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    await wrapper.setProps({ modelValue: '' })
    expect(wrapper.find('button').attributes('aria-expanded')).toBe('false')
  })

  it('forwards select cancellation and disabled links cannot activate', async () => {
    const select = vi.fn((event: Event) => event.preventDefault())
    const click = vi.fn()
    const wrapper = mount(NavigationMenu, {
      props: { label: 'Links' },
      slots: {
        default: () => [
          h(NavigationMenuItem, {}, () =>
            h(NavigationMenuLink, { href: '#enabled', onSelect: select }, () => 'Enabled'),
          ),
          h(NavigationMenuItem, {}, () =>
            h(
              NavigationMenuLink,
              { href: '#disabled', disabled: true, onClick: click, onSelect: select },
              () => 'Disabled',
            ),
          ),
        ],
      },
    })
    wrappers.push(wrapper)
    await wrapper.findAll('a')[0]!.trigger('click')
    expect(select).toHaveBeenCalledOnce()
    expect(select.mock.calls[0]![0].defaultPrevented).toBe(true)
    await wrapper.findAll('a')[1]!.trigger('click')
    expect(select).toHaveBeenCalledOnce()
    expect(click).not.toHaveBeenCalled()
    expect(wrapper.findAll('a')[1]!.attributes('aria-disabled')).toBe('true')
    expect(wrapper.findAll('a')[1]!.attributes('tabindex')).toBe('-1')
  })

  it('inherits size changes and forwards control slots without nested links', async () => {
    const wrapper = mount(NavigationMenu, {
      props: { label: 'Links', size: 'sm' },
      slots: {
        default: () =>
          h(NavigationMenuItem, {}, () =>
            h(NavigationMenuLink, { asChild: true, active: true }, () =>
              h('a', { href: '#custom' }, 'Custom'),
            ),
          ),
      },
    })
    wrappers.push(wrapper)
    expect(wrapper.findAll('a')).toHaveLength(1)
    expect(wrapper.find('a').attributes('aria-current')).toBe('page')
    expect(wrapper.find('a').classes().join(' ')).toContain('--hn-control-h-sm')
    await wrapper.setProps({ size: 'lg' })
    expect(wrapper.find('a').classes().join(' ')).toContain('--hn-control-h-lg')
  })

  it('has no accessibility violations', async () => {
    const wrapper = setup()
    await expectNoA11yViolations(wrapper.element)
  })
})
