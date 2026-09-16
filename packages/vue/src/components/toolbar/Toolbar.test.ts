import { afterEach, describe, expect, it, vi } from 'vitest'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import axe from 'axe-core'
import Toolbar from './Toolbar.vue'
import ToolbarButton from './ToolbarButton.vue'
import ToolbarLink from './ToolbarLink.vue'
import ToolbarToggleGroup from './ToolbarToggleGroup.vue'
import ToolbarToggleItem from './ToolbarToggleItem.vue'
import ToolbarSeparator from './ToolbarSeparator.vue'
import Button from '../button/Button.vue'
import Toggle from '../toggle/Toggle.vue'

const wrappers: VueWrapper[] = []
afterEach(() => {
  wrappers.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})

function setup(props = {}) {
  const wrapper = mount(Toolbar, {
    attachTo: document.body,
    props: { label: 'Actions', ...props },
    slots: {
      default: () => [
        h(ToolbarButton, {}, () => 'First'),
        h(ToolbarButton, { disabled: true }, () => 'Disabled'),
        h(ToolbarSeparator),
        h(ToolbarLink, { href: '#help' }, () => 'Help'),
      ],
    },
  })
  wrappers.push(wrapper)
  return wrapper
}

describe('Toolbar', () => {
  it('provides a named toolbar, safe button types, links and perpendicular separators', async () => {
    const wrapper = setup()
    expect(wrapper.attributes('role')).toBe('toolbar')
    expect(wrapper.attributes('aria-label')).toBe('Actions')
    expect(wrapper.attributes('aria-orientation')).toBe('horizontal')
    expect(wrapper.find('button').attributes('type')).toBe('button')
    expect(wrapper.find('a').attributes('href')).toBe('#help')
    expect(wrapper.find('a').attributes('type')).toBeUndefined()
    expect(wrapper.find('[role=none]').attributes('data-orientation')).toBe('vertical')
    await wrapper.setProps({ orientation: 'vertical' })
    expect(wrapper.attributes('aria-orientation')).toBe('vertical')
    expect(wrapper.find('[role=none]').attributes('data-orientation')).toBe('horizontal')
  })

  it('inherits sizing and root disabled state reactively', async () => {
    const wrapper = setup({ size: 'sm' })
    expect(wrapper.find('button').classes().join(' ')).toContain('--hn-control-h-sm')
    await wrapper.setProps({ size: 'lg', disabled: true })
    expect(wrapper.find('button').classes().join(' ')).toContain('--hn-control-h-lg')
    expect(wrapper.findAll('button').every(button => button.element.disabled)).toBe(true)
    expect(wrapper.find('a').attributes('aria-disabled')).toBe('true')
    await wrapper.setProps({ disabled: false })
    expect(wrapper.findAll('button').map(button => button.element.disabled)).toEqual([false, true])
    expect(wrapper.find('a').attributes('aria-disabled')).toBeUndefined()
  })

  it('allows per-control sizes and custom button composition without nested buttons', async () => {
    const pressed = ref(false)
    const click = vi.fn()
    const wrapper = mount(Toolbar, {
      props: { label: 'Custom', size: 'lg' },
      slots: {
        default: () => [
          h(ToolbarButton, { size: 'sm', onClick: click }, () => 'Small'),
          h(ToolbarButton, { asChild: true }, () => h(Button, { variant: 'soft' }, () => 'Custom')),
          h(ToolbarButton, { asChild: true }, () =>
            h(
              Toggle,
              {
                modelValue: pressed.value,
                'onUpdate:modelValue': value => (pressed.value = value),
              },
              () => 'Toggle',
            ),
          ),
        ],
      },
    })
    wrappers.push(wrapper)
    expect(wrapper.find('button').classes().join(' ')).toContain('--hn-control-h-sm')
    expect(wrapper.findAll('button')).toHaveLength(3)
    expect(wrapper.find('button button').exists()).toBe(false)
    await wrapper.findAll('button')[0]!.trigger('click')
    expect(click).toHaveBeenCalledTimes(1)
    await wrapper.findAll('button')[2]!.trigger('click')
    expect(pressed.value).toBe(true)
  })

  it('supports controlled single selection and clearing the current item', async () => {
    const value = ref<string>()
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Toolbar, { label: 'Alignment' }, () =>
            h(
              ToolbarToggleGroup,
              {
                modelValue: value.value,
                'onUpdate:modelValue': v => (value.value = v as string),
                type: 'single',
              },
              () => [
                h(ToolbarToggleItem, { value: 'start' }, () => 'Start'),
                h(ToolbarToggleItem, { value: 'center' }, () => 'Center'),
              ],
            ),
          ),
      }),
    )
    wrappers.push(wrapper)
    const buttons = wrapper.findAll('button')
    await buttons[0]!.trigger('click')
    expect(value.value).toBe('start')
    expect(buttons[0]!.attributes('aria-pressed')).toBe('true')
    await buttons[1]!.trigger('click')
    expect(value.value).toBe('center')
    expect(buttons[0]!.attributes('aria-pressed')).toBe('false')
    await buttons[1]!.trigger('click')
    expect(value.value).toBeUndefined()
  })

  it('supports independent multiple selections and uncontrolled defaults', async () => {
    const wrapper = mount(Toolbar, {
      props: { label: 'Formats' },
      slots: {
        default: () =>
          h(
            ToolbarToggleGroup,
            {
              type: 'multiple',
              defaultValue: ['bold'],
            },
            () => [
              h(ToolbarToggleItem, { value: 'bold' }, () => 'Bold'),
              h(ToolbarToggleItem, { value: 'italic' }, () => 'Italic'),
            ],
          ),
      },
    })
    wrappers.push(wrapper)
    const buttons = wrapper.findAll('button')
    expect(buttons[0]!.attributes('aria-pressed')).toBe('true')
    await buttons[1]!.trigger('click')
    expect(buttons.every(button => button.attributes('aria-pressed') === 'true')).toBe(true)
    await buttons[0]!.trigger('click')
    expect(buttons[0]!.attributes('aria-pressed')).toBe('false')
    expect(buttons[1]!.attributes('aria-pressed')).toBe('true')
  })

  it('combines group, root, item disabled and loading states', async () => {
    const disabled = ref(true)
    const loading = ref(true)
    const wrapper = mount(Toolbar, {
      props: { label: 'Disabled' },
      slots: {
        default: () => [
          h(ToolbarToggleGroup, { disabled: disabled.value }, () => [
            h(ToolbarToggleItem, { value: 'one' }, () => 'One'),
            h(ToolbarToggleItem, { value: 'two', disabled: true }, () => 'Two'),
          ]),
          h(ToolbarButton, { loading: loading.value }, () => 'Save'),
        ],
      },
    })
    wrappers.push(wrapper)
    expect(wrapper.findAll('button').every(button => button.element.disabled)).toBe(true)
    disabled.value = false
    loading.value = false
    await nextTick()
    expect(wrapper.findAll('button').map(button => button.element.disabled)).toEqual([
      false,
      true,
      false,
    ])
    await wrapper.setProps({ disabled: true })
    expect(wrapper.findAll('button').every(button => button.element.disabled)).toBe(true)
  })

  it('does not activate disabled links or submit a surrounding form', async () => {
    const clicked = vi.fn()
    const wrapper = mount(Toolbar, {
      props: { label: 'Links' },
      slots: {
        default: () =>
          h(ToolbarLink, { href: '#help', disabled: true, onClick: clicked }, () => 'Help'),
      },
    })
    wrappers.push(wrapper)
    await wrapper.find('a').trigger('click')
    await wrapper.find('a').trigger('keydown', { key: ' ' })
    expect(clicked).not.toHaveBeenCalled()
  })

  it('keeps native attributes and accessible names on the interactive element', async () => {
    const wrapper = mount(Toolbar, {
      props: { label: 'Accessible toolbar' },
      slots: {
        default: () => [
          h(ToolbarButton, { label: 'Undo', tooltip: false }, () => '↶'),
          h(ToolbarToggleGroup, { label: 'Formatting', type: 'multiple' }, () =>
            h(ToolbarToggleItem, { value: 'bold', label: 'Bold' }, () => 'B'),
          ),
          h(ToolbarSeparator, { decorative: false }),
          h(ToolbarLink, { href: '#help', target: '_blank', rel: 'noopener' }, () => 'Help'),
        ],
      },
      attachTo: document.body,
    })
    wrappers.push(wrapper)
    expect(wrapper.find('button').attributes('aria-label')).toBe('Undo')
    expect(wrapper.find('[role=group]').attributes('aria-label')).toBe('Formatting')
    expect(wrapper.find('[role=separator]').attributes('aria-orientation')).toBe('vertical')
    expect(wrapper.find('a').attributes('target')).toBe('_blank')
    const result = await axe.run(wrapper.element, {
      rules: { 'color-contrast': { enabled: false } },
    })
    expect(result.violations).toEqual([])
  })
})
