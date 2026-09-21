import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { mount, type VueWrapper } from '@vue/test-utils'
import { defineComponent, h, nextTick, ref } from 'vue'
import axe from 'axe-core'
import Editable from './Editable.vue'
import type { EditableProps } from './types'
import FormField from '../form-field/FormField.vue'
import Dialog from '../dialog/Dialog.vue'
import '../../../test/browser.css'

const mounted: VueWrapper[] = []
afterEach(() => {
  mounted.splice(0).forEach(wrapper => wrapper.unmount())
  document.body.innerHTML = ''
})
function setup(props: EditableProps = {}, field = false) {
  const model = ref('Project title')
  const editing = ref(false)
  const disabled = ref(false)
  const submitted = vi.fn()
  const cancelled = vi.fn()
  const nativeSubmit = vi.fn((event: Event) => event.preventDefault())
  const host = document.createElement('div')
  host.style.cssText = 'width:320px;margin:40px'
  document.body.append(host)
  const control = () =>
    h(Editable, {
      ...props,
      disabled: props.disabled || disabled.value,
      modelValue: model.value,
      'onUpdate:modelValue': (value: string) => {
        model.value = value
      },
      editing: editing.value,
      'onUpdate:editing': (value: boolean) => {
        editing.value = value
      },
      ...(field ? {} : { 'aria-label': 'Title' }),
      onSubmit: submitted,
      onCancel: cancelled,
    })
  const wrapper = mount(
    defineComponent({
      setup: () => () =>
        h('form', { onSubmit: nativeSubmit }, [
          field
            ? h(
                FormField,
                { label: 'Title', description: 'Visible to everyone', name: 'title' },
                { default: control },
              )
            : control(),
          h('button', { type: 'button', 'data-outside': '' }, 'Next field'),
        ]),
    }),
    { attachTo: host },
  )
  mounted.push(wrapper)
  const input = () => wrapper.get('input:not([type=hidden]),textarea').element as HTMLInputElement
  const preview = () => wrapper.get('[data-hn-editable] > button').element as HTMLButtonElement
  const action = (label: string) =>
    wrapper.get(`button[aria-label="${label}"]`).element as HTMLButtonElement
  return {
    wrapper,
    model,
    editing,
    disabled,
    submitted,
    cancelled,
    nativeSubmit,
    input,
    preview,
    action,
    outside: wrapper.get('[data-outside]').element as HTMLButtonElement,
  }
}
async function enter(state: ReturnType<typeof setup>) {
  await userEvent.click(state.preview())
  await vi.waitFor(() => expect(state.editing.value).toBe(true))
  await vi.waitFor(() => expect(document.activeElement).toBe(state.input()))
}

it('keeps draft separate, submits on Enter, and returns focus without submitting its form', async () => {
  const s = setup({ name: 'title' })
  await enter(s)
  expect(s.input().selectionEnd).toBe('Project title'.length)
  await userEvent.fill(s.input(), 'New title')
  expect(s.model.value).toBe('Project title')
  expect(new FormData(s.wrapper.element as HTMLFormElement).get('title')).toBe('Project title')
  await userEvent.keyboard('{Enter}')
  await vi.waitFor(() => expect(s.model.value).toBe('New title'))
  expect(s.submitted).toHaveBeenCalledExactlyOnceWith('New title', 'Project title')
  expect(s.nativeSubmit).not.toHaveBeenCalled()
  await vi.waitFor(() => expect(document.activeElement).toBe(s.preview()))
})

it.each(['escape', 'button'])('cancels the draft using %s without a blur save', async method => {
  const save = vi.fn()
  const s = setup({ onSave: save })
  await enter(s)
  await userEvent.fill(s.input(), 'Discard me')
  if (method === 'escape') await userEvent.keyboard('{Escape}')
  else await userEvent.click(s.action('取消'))
  await vi.waitFor(() => expect(s.editing.value).toBe(false))
  expect(s.model.value).toBe('Project title')
  expect(save).not.toHaveBeenCalled()
  expect(s.cancelled).toHaveBeenCalledExactlyOnceWith('Discard me')
  await enter(s)
  expect(s.input().value).toBe('Project title')
})

it('submits when focus leaves the whole component, not when it moves to a save control', async () => {
  const save = vi.fn()
  const s = setup({ onSave: save })
  await enter(s)
  await userEvent.fill(s.input(), 'Changed')
  await userEvent.tab()
  expect(save).not.toHaveBeenCalled()
  expect(s.editing.value).toBe(true)
  await userEvent.click(s.outside)
  await vi.waitFor(() => expect(s.model.value).toBe('Changed'))
  expect(document.activeElement).toBe(s.outside)
})

it('does not resave an unchanged value', async () => {
  const save = vi.fn()
  const s = setup({ onSave: save })
  await enter(s)
  await userEvent.keyboard('{Enter}')
  await vi.waitFor(() => expect(s.editing.value).toBe(false))
  expect(save).not.toHaveBeenCalled()
  expect(s.submitted).not.toHaveBeenCalled()
})

it.each(['enter', 'manual'] as const)(
  'keeps the draft on outside focus in %s mode',
  async submitMode => {
    const s = setup({ submitMode })
    await enter(s)
    await userEvent.fill(s.input(), 'Draft')
    await userEvent.click(s.outside)
    expect(s.editing.value).toBe(true)
    expect(s.input().value).toBe('Draft')
    expect(s.model.value).toBe('Project title')
  },
)

it.each(['blur', 'manual'] as const)(
  'Enter does not submit the outer form in %s mode',
  async submitMode => {
    const s = setup({ submitMode })
    await enter(s)
    await userEvent.fill(s.input(), 'Draft')
    await userEvent.keyboard('{Enter}')
    expect(s.editing.value).toBe(true)
    expect(s.nativeSubmit).not.toHaveBeenCalled()
    await userEvent.click(s.action('保存'))
    await vi.waitFor(() => expect(s.model.value).toBe('Draft'))
  },
)

it('supports double click and keyboard activation without editing on focus alone', async () => {
  const s = setup({ activationMode: 'dblclick' })
  s.preview().focus()
  await userEvent.click(s.preview())
  expect(s.editing.value).toBe(false)
  await userEvent.dblClick(s.preview())
  await vi.waitFor(() => expect(s.editing.value).toBe(true))
  await userEvent.keyboard('{Escape}')
  await userEvent.keyboard('{Enter}')
  await vi.waitFor(() => expect(s.editing.value).toBe(true))
})

it('supports manual activation and controlled editing', async () => {
  const s = setup({ activationMode: 'manual' })
  await userEvent.click(s.action('编辑'))
  await vi.waitFor(() => expect(document.activeElement).toBe(s.input()))
  s.editing.value = false
  await nextTick()
  expect(s.wrapper.find('input:not([type=hidden])').exists()).toBe(false)
  s.editing.value = true
  await vi.waitFor(() => expect(document.activeElement).toBe(s.input()))
})

it('allows multiline Enter and saves on Control+Enter', async () => {
  const s = setup({ multiline: true })
  await enter(s)
  await userEvent.fill(s.input(), 'First')
  s.input().setSelectionRange(5, 5)
  await userEvent.keyboard('{Enter}Second')
  expect(s.input().value).toBe('First\nSecond')
  expect(s.submitted).not.toHaveBeenCalled()
  await userEvent.keyboard('{Control>}{Enter}{/Control}')
  await vi.waitFor(() => expect(s.model.value).toBe('First\nSecond'))
})

it('scrolls long multiline drafts in ScrollArea and keeps the caret visible', async () => {
  const s = setup({ multiline: true, rows: 3, selectOnFocus: false })
  const original = Array.from({ length: 20 }, (_, i) => `Line ${i + 1}`).join('\n')
  s.model.value = original
  await nextTick()
  await enter(s)
  await vi.waitFor(() =>
    expect(s.wrapper.find('[data-overlayscrollbars-viewport]').exists()).toBe(true),
  )
  const viewport = s.wrapper.get('[data-overlayscrollbars-viewport]').element as HTMLElement
  expect(getComputedStyle(s.input()).overflowY).toBe('hidden')
  expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
  await userEvent.keyboard('{Control>}{End}{/Control}{Enter}Last line')
  await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
  expect(s.input().scrollTop).toBe(0)
  expect(s.input().value).toBe(`${original}\nLast line`)
  expect(s.wrapper.getComponent(Editable).vm.input).toBe(s.input())
  await userEvent.keyboard('{Escape}')
  expect(s.model.value).toBe(original)
  await enter(s)
  expect(s.input().value).toBe(original)
})

it('blocks duplicate saves and keeps draft on failure for retry', async () => {
  let reject!: (reason: unknown) => void
  const save = vi
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise((_, no) => {
          reject = no
        }),
    )
    .mockResolvedValue(undefined)
  const s = setup({ onSave: save })
  await enter(s)
  await userEvent.fill(s.input(), 'Changed')
  await userEvent.keyboard('{Enter}{Enter}')
  expect(save).toHaveBeenCalledTimes(1)
  expect(s.input().readOnly).toBe(true)
  expect(s.model.value).toBe('Project title')
  await userEvent.keyboard('{Escape}')
  expect(s.editing.value).toBe(true)
  reject(new Error('Name already in use'))
  await vi.waitFor(() => expect(s.wrapper.get('[role=alert]').text()).toBe('Name already in use'))
  expect(s.input().value).toBe('Changed')
  expect(s.input().getAttribute('aria-invalid')).toBe('true')
  await userEvent.fill(s.input(), 'Available')
  expect(s.wrapper.find('[role=alert]').exists()).toBe(false)
  await userEvent.keyboard('{Enter}')
  await vi.waitFor(() => expect(s.model.value).toBe('Available'))
  expect(save).toHaveBeenCalledTimes(2)
})

it.each(['reset', 'close', 'disable', 'unmount'])('ignores a late save after %s', async change => {
  let resolve!: () => void
  const s = setup({
    onSave: () =>
      new Promise<void>(yes => {
        resolve = yes
      }),
  })
  await enter(s)
  await userEvent.fill(s.input(), 'Stale draft')
  await userEvent.keyboard('{Enter}')
  if (change === 'reset') s.model.value = 'Server reset'
  if (change === 'close') s.editing.value = false
  if (change === 'disable') s.disabled.value = true
  if (change === 'unmount') s.wrapper.unmount()
  await nextTick()
  resolve()
  await new Promise(resolve => setTimeout(resolve, 20))
  expect(s.model.value).toBe(change === 'reset' ? 'Server reset' : 'Project title')
  expect(s.submitted).not.toHaveBeenCalled()
})

it.each(['readonly', 'disabled'] as const)('does not enter editing when %s', async state => {
  const s = setup({ [state]: true })
  s.wrapper.getComponent(Editable).vm.edit()
  await nextTick()
  expect(s.editing.value).toBe(false)
  expect(s.wrapper.find('input:not([type=hidden])').exists()).toBe(false)
})

it('honors native constraints and FormField associations in both states', async () => {
  const s = setup({ required: true, maxlength: 40 }, true)
  expect(s.wrapper.get('label').attributes('for')).toBe(s.preview().id)
  await enter(s)
  expect(s.wrapper.get('label').attributes('for')).toBe(s.input().id)
  expect(s.input().getAttribute('aria-describedby')).toBeTruthy()
  await userEvent.fill(s.input(), '')
  await userEvent.keyboard('{Enter}')
  expect(s.editing.value).toBe(true)
  expect(s.wrapper.find('[role=alert]').exists()).toBe(true)
  const audit = await axe.run(s.wrapper.element, { rules: { region: { enabled: false } } })
  expect(audit.violations).toEqual([])
})

it('leaves IME Enter and Escape alone and keeps its surrounding dialog open', async () => {
  const open = ref(true)
  const wrapper = mount(
    defineComponent({
      setup: () => () =>
        h(
          Dialog,
          {
            open: open.value,
            'onUpdate:open': (value: boolean | undefined) => {
              open.value = !!value
            },
            title: 'Details',
          },
          { content: () => h(Editable, { modelValue: 'Title', 'aria-label': 'Title' }) },
        ),
    }),
    { attachTo: document.body },
  )
  mounted.push(wrapper)
  await vi.waitFor(() =>
    expect(document.querySelector('[data-hn-editable] > button')).not.toBeNull(),
  )
  await userEvent.click(document.querySelector('[data-hn-editable] > button')!)
  const input = document.querySelector('[data-hn-editable] input')!
  input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
  input.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, key: 'Enter', isComposing: true }),
  )
  input.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, key: 'Escape', isComposing: true }),
  )
  expect(document.querySelector('[data-hn-editable] textarea,input')).not.toBeNull()
  expect(open.value).toBe(true)
  input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }))
  await userEvent.keyboard('{Escape}')
  expect(open.value).toBe(true)
})

it('keeps preview and input width, height and text inset aligned in RTL', async () => {
  const s = setup()
  s.wrapper.element.setAttribute('dir', 'rtl')
  const before = s.preview().getBoundingClientRect()
  const inset = getComputedStyle(s.preview()).paddingInlineStart
  await enter(s)
  const after = s.input().getBoundingClientRect()
  expect(after.width).toBeCloseTo(before.width, 1)
  expect(after.height).toBeCloseTo(before.height, 1)
  expect(getComputedStyle(s.input()).paddingInlineStart).toBe(inset)
})
