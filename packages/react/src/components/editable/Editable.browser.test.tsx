import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import { createRef, useState } from 'react'
import { flushSync } from 'react-dom'
import axe from 'axe-core'
import { Editable } from './Editable'
import type { EditableHandle, EditableProps } from './types'
import { FormField } from '../form-field/FormField'
import { Dialog } from '../dialog/Dialog'
import '../../../test/browser.css'

const unmounts: Array<() => void> = []

afterEach(() => {
  unmounts.splice(0).forEach(unmount => unmount())
  document.body.innerHTML = ''
})

async function setup(props: Partial<EditableProps> = {}, field = false) {
  const submitted = vi.fn()
  const cancelled = vi.fn()
  const nativeSubmit = vi.fn((event: { preventDefault: () => void }) => event.preventDefault())
  const handle = createRef<EditableHandle>()
  const state = {
    model: 'Project title',
    editing: false,
    disabled: false,
    setModel: (_: string) => {},
    setEditing: (_: boolean) => {},
    setDisabled: (_: boolean) => {},
  }

  function Harness() {
    const [model, setModel] = useState(state.model)
    const [editing, setEditing] = useState(state.editing)
    const [disabled, setDisabled] = useState(state.disabled)
    state.model = model
    state.editing = editing
    state.disabled = disabled
    state.setModel = value => flushSync(() => setModel(value))
    state.setEditing = value => flushSync(() => setEditing(value))
    state.setDisabled = value => flushSync(() => setDisabled(value))
    const control = (
      <Editable
        ref={handle}
        {...props}
        disabled={props.disabled || disabled}
        value={model}
        onValueChange={setModel}
        editing={editing}
        onEditingChange={setEditing}
        {...(field ? {} : { 'aria-label': 'Title' })}
        onSubmit={submitted}
        onCancel={cancelled}
      />
    )
    return (
      <form onSubmit={nativeSubmit}>
        {field ? (
          <FormField label="Title" description="Visible to everyone" name="title">
            {control}
          </FormField>
        ) : (
          control
        )}
        <button type="button" data-outside="">
          Next field
        </button>
      </form>
    )
  }

  const host = document.createElement('div')
  host.style.cssText = 'width:320px;margin:40px'
  document.body.append(host)
  const screen = await render(<Harness />, { container: host })
  unmounts.push(() => screen.unmount())
  const element = host.firstElementChild as HTMLFormElement
  const get = (selector: string) => element.querySelector(selector) as HTMLElement
  return {
    screen,
    element,
    state,
    handle,
    submitted,
    cancelled,
    nativeSubmit,
    get,
    input: () => get('input:not([type=hidden]),textarea') as HTMLInputElement,
    preview: () => get('[data-hn-editable] > button') as HTMLButtonElement,
    action: (label: string) => get(`button[aria-label="${label}"]`) as HTMLButtonElement,
    outside: get('[data-outside]') as HTMLButtonElement,
  }
}

type State = Awaited<ReturnType<typeof setup>>

async function enter(s: State) {
  await userEvent.click(s.preview())
  await vi.waitFor(() => expect(s.state.editing).toBe(true))
  await vi.waitFor(() => expect(document.activeElement).toBe(s.input()))
}

function frame() {
  return new Promise(resolve => requestAnimationFrame(resolve))
}

it('keeps draft separate, submits on Enter, and returns focus without submitting its form', async () => {
  const s = await setup({ name: 'title' })
  await enter(s)
  expect(s.input().selectionEnd).toBe('Project title'.length)
  await userEvent.fill(s.input(), 'New title')
  expect(s.state.model).toBe('Project title')
  expect(new FormData(s.element).get('title')).toBe('Project title')
  await userEvent.keyboard('{Enter}')
  await vi.waitFor(() => expect(s.state.model).toBe('New title'))
  expect(s.submitted).toHaveBeenCalledExactlyOnceWith('New title', 'Project title')
  expect(s.nativeSubmit).not.toHaveBeenCalled()
  await vi.waitFor(() => expect(document.activeElement).toBe(s.preview()))
})

it.each(['escape', 'button'])('cancels the draft using %s without a blur save', async method => {
  const save = vi.fn()
  const s = await setup({ onSave: save })
  await enter(s)
  await userEvent.fill(s.input(), 'Discard me')
  if (method === 'escape') await userEvent.keyboard('{Escape}')
  else await userEvent.click(s.action('取消'))
  await vi.waitFor(() => expect(s.state.editing).toBe(false))
  expect(s.state.model).toBe('Project title')
  expect(save).not.toHaveBeenCalled()
  expect(s.cancelled).toHaveBeenCalledExactlyOnceWith('Discard me')
  await enter(s)
  expect(s.input().value).toBe('Project title')
})

it('submits when focus leaves the whole component, not when it moves to a save control', async () => {
  const save = vi.fn()
  const s = await setup({ onSave: save })
  await enter(s)
  await userEvent.fill(s.input(), 'Changed')
  await userEvent.tab()
  expect(save).not.toHaveBeenCalled()
  expect(s.state.editing).toBe(true)
  await userEvent.click(s.outside)
  await vi.waitFor(() => expect(s.state.model).toBe('Changed'))
  expect(document.activeElement).toBe(s.outside)
})

it('does not resave an unchanged value', async () => {
  const save = vi.fn()
  const s = await setup({ onSave: save })
  await enter(s)
  await userEvent.keyboard('{Enter}')
  await vi.waitFor(() => expect(s.state.editing).toBe(false))
  expect(save).not.toHaveBeenCalled()
  expect(s.submitted).not.toHaveBeenCalled()
})

it.each(['enter', 'manual'] as const)(
  'keeps the draft on outside focus in %s mode',
  async submitMode => {
    const s = await setup({ submitMode })
    await enter(s)
    await userEvent.fill(s.input(), 'Draft')
    await userEvent.click(s.outside)
    expect(s.state.editing).toBe(true)
    expect(s.input().value).toBe('Draft')
    expect(s.state.model).toBe('Project title')
  },
)

it.each(['blur', 'manual'] as const)(
  'Enter does not submit the outer form in %s mode',
  async submitMode => {
    const s = await setup({ submitMode })
    await enter(s)
    await userEvent.fill(s.input(), 'Draft')
    await userEvent.keyboard('{Enter}')
    expect(s.state.editing).toBe(true)
    expect(s.nativeSubmit).not.toHaveBeenCalled()
    await userEvent.click(s.action('保存'))
    await vi.waitFor(() => expect(s.state.model).toBe('Draft'))
  },
)

it('supports double click and keyboard activation without editing on focus alone', async () => {
  const s = await setup({ activationMode: 'dblclick' })
  s.preview().focus()
  await userEvent.click(s.preview())
  expect(s.state.editing).toBe(false)
  await userEvent.dblClick(s.preview())
  await vi.waitFor(() => expect(s.state.editing).toBe(true))
  await userEvent.keyboard('{Escape}')
  await userEvent.keyboard('{Enter}')
  await vi.waitFor(() => expect(s.state.editing).toBe(true))
})

it('supports manual activation and controlled editing', async () => {
  const s = await setup({ activationMode: 'manual' })
  await userEvent.click(s.action('编辑'))
  await vi.waitFor(() => expect(document.activeElement).toBe(s.input()))
  s.state.setEditing(false)
  expect(s.element.querySelector('input:not([type=hidden])')).toBeNull()
  s.state.setEditing(true)
  await vi.waitFor(() => expect(document.activeElement).toBe(s.input()))
})

it('allows multiline Enter and saves on Control+Enter', async () => {
  const s = await setup({ multiline: true })
  await enter(s)
  await userEvent.fill(s.input(), 'First')
  s.input().setSelectionRange(5, 5)
  await userEvent.keyboard('{Enter}Second')
  expect(s.input().value).toBe('First\nSecond')
  expect(s.submitted).not.toHaveBeenCalled()
  await userEvent.keyboard('{Control>}{Enter}{/Control}')
  await vi.waitFor(() => expect(s.state.model).toBe('First\nSecond'))
})

it('scrolls long multiline drafts in ScrollArea and keeps the caret visible', async () => {
  const s = await setup({ multiline: true, rows: 3, selectOnFocus: false })
  const original = Array.from({ length: 20 }, (_, i) => `Line ${i + 1}`).join('\n')
  s.state.setModel(original)
  await enter(s)
  await vi.waitFor(() =>
    expect(s.element.querySelector('[data-overlayscrollbars-viewport]')).not.toBeNull(),
  )
  const viewport = s.get('[data-overlayscrollbars-viewport]')
  expect(getComputedStyle(s.input()).overflowY).toBe('hidden')
  expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
  await userEvent.keyboard('{Control>}{End}{/Control}{Enter}Last line')
  await vi.waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
  expect(s.input().scrollTop).toBe(0)
  expect(s.input().value).toBe(`${original}\nLast line`)
  expect(s.handle.current!.input).toBe(s.input())
  await userEvent.keyboard('{Escape}')
  expect(s.state.model).toBe(original)
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
  const s = await setup({ onSave: save })
  await enter(s)
  await userEvent.fill(s.input(), 'Changed')
  await userEvent.keyboard('{Enter}{Enter}')
  expect(save).toHaveBeenCalledTimes(1)
  expect(s.input().readOnly).toBe(true)
  expect(s.state.model).toBe('Project title')
  await userEvent.keyboard('{Escape}')
  expect(s.state.editing).toBe(true)
  reject(new Error('Name already in use'))
  await vi.waitFor(() => expect(s.get('[role=alert]')?.textContent).toBe('Name already in use'))
  expect(s.input().value).toBe('Changed')
  expect(s.input().getAttribute('aria-invalid')).toBe('true')
  await userEvent.fill(s.input(), 'Available')
  expect(s.element.querySelector('[role=alert]')).toBeNull()
  await userEvent.keyboard('{Enter}')
  await vi.waitFor(() => expect(s.state.model).toBe('Available'))
  expect(save).toHaveBeenCalledTimes(2)
})

it.each(['reset', 'close', 'disable', 'unmount'])('ignores a late save after %s', async change => {
  let resolve!: () => void
  const s = await setup({
    onSave: () =>
      new Promise<void>(yes => {
        resolve = yes
      }),
  })
  await enter(s)
  await userEvent.fill(s.input(), 'Stale draft')
  await userEvent.keyboard('{Enter}')
  if (change === 'reset') s.state.setModel('Server reset')
  if (change === 'close') s.state.setEditing(false)
  if (change === 'disable') s.state.setDisabled(true)
  if (change === 'unmount') s.screen.unmount()
  await frame()
  resolve()
  await new Promise(resolve => setTimeout(resolve, 20))
  expect(s.state.model).toBe(change === 'reset' ? 'Server reset' : 'Project title')
  expect(s.submitted).not.toHaveBeenCalled()
})

it.each(['readonly', 'disabled'] as const)('does not enter editing when %s', async state => {
  const s = await setup(state === 'readonly' ? { readonly: true } : { disabled: true })
  s.handle.current!.edit()
  await frame()
  expect(s.state.editing).toBe(false)
  expect(s.element.querySelector('input:not([type=hidden])')).toBeNull()
})

it('honors native constraints and FormField associations in both states', async () => {
  const s = await setup({ required: true, maxlength: 40 }, true)
  expect(s.get('label').getAttribute('for')).toBe(s.preview().id)
  await enter(s)
  expect(s.get('label').getAttribute('for')).toBe(s.input().id)
  expect(s.input().getAttribute('aria-describedby')).toBeTruthy()
  await userEvent.fill(s.input(), '')
  await userEvent.keyboard('{Enter}')
  expect(s.state.editing).toBe(true)
  expect(s.element.querySelector('[role=alert]')).not.toBeNull()
  const audit = await axe.run(s.element, { rules: { region: { enabled: false } } })
  expect(audit.violations).toEqual([])
})

it('leaves IME Enter and Escape alone and keeps its surrounding dialog open', async () => {
  const state = { open: true }
  function Harness() {
    const [open, setOpen] = useState(true)
    state.open = open
    return (
      <Dialog
        open={open}
        onOpenChange={value => setOpen(!!value)}
        title="Details"
        renderContent={() => <Editable defaultValue="Title" aria-label="Title" />}
      />
    )
  }
  const screen = await render(<Harness />)
  unmounts.push(() => screen.unmount())
  await vi.waitFor(() =>
    expect(document.querySelector('[data-hn-editable] > button')).not.toBeNull(),
  )
  await userEvent.click(document.querySelector('[data-hn-editable] > button')!)
  await vi.waitFor(() => expect(document.querySelector('[data-hn-editable] input')).not.toBeNull())
  const input = document.querySelector('[data-hn-editable] input')!
  input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
  input.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, key: 'Enter', isComposing: true }),
  )
  input.dispatchEvent(
    new KeyboardEvent('keydown', { bubbles: true, key: 'Escape', isComposing: true }),
  )
  expect(document.querySelector('[data-hn-editable] textarea,input')).not.toBeNull()
  expect(state.open).toBe(true)
  input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }))
  await userEvent.keyboard('{Escape}')
  expect(state.open).toBe(true)
})

it('keeps preview and input width, height and text inset aligned in RTL', async () => {
  const s = await setup()
  s.element.setAttribute('dir', 'rtl')
  const before = s.preview().getBoundingClientRect()
  const inset = getComputedStyle(s.preview()).paddingInlineStart
  await enter(s)
  const after = s.input().getBoundingClientRect()
  expect(after.width).toBeCloseTo(before.width, 1)
  expect(after.height).toBeCloseTo(before.height, 1)
  expect(getComputedStyle(s.input()).paddingInlineStart).toBe(inset)
})
