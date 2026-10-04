import { afterEach, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { render } from 'vitest-browser-react'
import axe from 'axe-core'
import { Autocomplete } from './Autocomplete'
import type { AutocompleteOption, CompletionContext, CompletionEdit } from './types'
import { FormField } from '../form-field/FormField'
import { Dialog } from '../dialog/Dialog'
import { signal, tick } from '../../../test/signal'
import '../../../test/browser.css'

const mounted: Array<{ unmount: () => Promise<void> | void }> = []
afterEach(async () => {
  for (const wrapper of mounted.splice(0)) await wrapper.unmount()
  document.body.innerHTML = ''
})

const initial = [
  { value: 'status', label: 'status:' },
  { value: 'off', label: 'disabled', disabled: true },
  { value: 'duration', label: 'duration:' },
]
async function setup(
  config: {
    text?: string
    options?: AutocompleteOption[]
    selectOnTab?: boolean
    disabled?: boolean
    readonly?: boolean
    field?: boolean
    getCompletion?: (option: AutocompleteOption, context: CompletionContext) => CompletionEdit
  } = {},
) {
  const model = signal(config.text ?? '')
  const open = signal(false)
  const options = signal(config.options ?? initial)
  const loading = signal(false)
  const query = vi.fn()
  const submit = vi.fn()
  const selected = vi.fn()
  const cleared = vi.fn()
  const host = document.createElement('div')
  host.style.cssText = 'width: 320px; margin: 40px;'
  document.body.append(host)
  function Input() {
    const text = model.use()
    const visible = open.use()
    const list = options.use()
    const busy = loading.use()
    return (
      <Autocomplete
        selectOnTab={config.selectOnTab}
        disabled={config.disabled}
        readonly={config.readonly}
        getCompletion={config.getCompletion}
        value={text}
        onValueChange={value => {
          model.value = value
        }}
        open={visible}
        onOpenChange={value => {
          open.value = value
        }}
        options={list}
        loading={busy}
        {...(config.field ? {} : { 'aria-label': 'Query' })}
        onQuery={query}
        onSubmit={submit}
        onSelect={selected}
        onClear={cleared}
      />
    )
  }
  const screen = await render(
    <form onSubmit={event => event.preventDefault()}>
      {config.field ? (
        <FormField label="Query" description="Filter requests">
          <Input />
        </FormField>
      ) : (
        <Input />
      )}
      <button type="button">Next</button>
    </form>,
    { container: host },
  )
  mounted.push(screen)
  return {
    element: host.firstElementChild as HTMLElement,
    input: host.querySelector('input') as HTMLInputElement,
    model,
    open,
    options,
    loading,
    query,
    submit,
    selected,
    cleared,
  }
}
const rows = () => [...document.querySelectorAll<HTMLElement>('[role="option"]')]
const list = () => document.querySelector<HTMLElement>('[role="listbox"]')
async function expanded(input: HTMLInputElement) {
  await userEvent.click(input)
  await vi.waitFor(() => expect(list()).not.toBeNull())
}

it('retains free text on blur and Enter submits without auto-highlighting a suggestion', async () => {
  const { input, model, submit } = await setup()
  await expanded(input)
  await userEvent.keyboard('unknown:value')
  expect(input.hasAttribute('aria-activedescendant')).toBe(false)
  await userEvent.keyboard('{Enter}')
  expect(submit).toHaveBeenCalledExactlyOnceWith('unknown:value')
  await userEvent.click(document.querySelector('button')!)
  expect(model.value).toBe('unknown:value')
  expect(input.value).toBe('unknown:value')
})

it('replaces the current token, keeps its suffix, and completes key then value without losing the caret', async () => {
  const { input, options, model, open, query, submit } = await setup({
    text: 'entry:http sta duration:>500ms',
    getCompletion: option => ({
      range: option.value === 'status' ? [11, 14] : [18, 18],
      text: option.label,
      keepOpen: option.value === 'status',
    }),
  })
  await expanded(input)
  input.setSelectionRange(14, 14)
  await userEvent.keyboard('{ArrowDown}{Enter}')
  await vi.waitFor(() => expect(input.selectionStart).toBe(18))
  expect(model.value).toBe('entry:http status: duration:>500ms')
  expect(open.value).toBe(true)
  expect(query).toHaveBeenLastCalledWith({
    text: model.value,
    selectionStart: 18,
    selectionEnd: 18,
  })
  options.value = [{ value: 'error', label: 'error' }]
  await tick()
  await userEvent.keyboard('{ArrowDown}{Enter}')
  await vi.waitFor(() => expect(input.selectionStart).toBe(23))
  expect(model.value).toBe('entry:http status:error duration:>500ms')
  expect(open.value).toBe(false)
  expect(document.activeElement).toBe(input)
  expect(submit).not.toHaveBeenCalled()
})

it('pointer selection retains input focus and supports a selected text range', async () => {
  const { input, model } = await setup({
    text: 'one TWO three',
    getCompletion: (_, context) => ({
      range: [context.selectionStart, context.selectionEnd],
      text: '二',
    }),
  })
  await expanded(input)
  input.setSelectionRange(4, 7)
  await userEvent.click(rows()[0]!)
  await vi.waitFor(() => expect(model.value).toBe('one 二 three'))
  expect(input.selectionStart).toBe(5)
  expect(document.activeElement).toBe(input)
})

it('accepts an externally opened suggestion without reopening when focus is restored', async () => {
  const { input, open, model } = await setup()
  open.value = true
  await vi.waitFor(() => expect(list()).not.toBeNull())
  await userEvent.click(rows()[0]!)
  await vi.waitFor(() => expect(model.value).toBe('status:'))
  expect(document.activeElement).toBe(input)
  expect(open.value).toBe(false)
})

it('reports caret movement independently of text and clears prior highlight', async () => {
  const { input, query } = await setup({ text: 'entry:http status:error' })
  await expanded(input)
  await userEvent.keyboard('{ArrowDown}')
  input.setSelectionRange(3, 7)
  await vi.waitFor(() =>
    expect(query).toHaveBeenLastCalledWith({
      text: input.value,
      selectionStart: 3,
      selectionEnd: 7,
    }),
  )
  expect(input.hasAttribute('aria-activedescendant')).toBe(false)
})

it('highlights the first fresh result when an arrow reopens a list with regenerated options', async () => {
  const { input, query, options } = await setup()
  query.mockImplementation(() => {
    options.value = initial.map(option => ({ ...option }))
  })
  await expanded(input)
  await userEvent.keyboard('{Escape}{ArrowDown}')
  await vi.waitFor(() => expect(input.getAttribute('aria-activedescendant')).toBe(rows()[0]!.id))
  await userEvent.keyboard('{Escape}{ArrowUp}')
  await vi.waitFor(() => expect(input.getAttribute('aria-activedescendant')).toBe(rows()[2]!.id))
})

it('skips disabled suggestions and preserves native editing keys', async () => {
  const { input, model } = await setup({ text: 'query' })
  await expanded(input)
  await userEvent.keyboard('{ArrowDown}{ArrowDown}')
  expect(input.getAttribute('aria-activedescendant')).toBe(rows()[2]!.id)
  await userEvent.keyboard('{ArrowUp}')
  expect(input.getAttribute('aria-activedescendant')).toBe(rows()[0]!.id)
  await userEvent.keyboard('{Enter}')
  await vi.waitFor(() => expect(model.value).toBe('status:'))
  await userEvent.keyboard('{Home}')
  expect(input.selectionStart).toBe(0)
})

it('Escape closes before clearing, while composition keys leave text and popup untouched', async () => {
  const { input, model, open, cleared, submit } = await setup({ text: 'draft' })
  await expanded(input)
  input.dispatchEvent(new CompositionEvent('compositionstart', { bubbles: true }))
  for (const key of ['Enter', 'Escape', 'ArrowDown', 'Tab'])
    input.dispatchEvent(
      new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, isComposing: true }),
    )
  expect(model.value).toBe('draft')
  expect(open.value).toBe(true)
  expect(submit).not.toHaveBeenCalled()
  input.value = '草稿'
  input.dispatchEvent(new CompositionEvent('compositionend', { bubbles: true }))
  await tick()
  expect(model.value).toBe('草稿')
  await userEvent.keyboard('{Escape}')
  expect(open.value).toBe(false)
  expect(model.value).toBe('草稿')
  await userEvent.keyboard('{Escape}')
  expect(model.value).toBe('')
  expect(open.value).toBe(false)
  expect(cleared).toHaveBeenCalledTimes(1)
})

it.each([false, true])(
  'Tab acceptance is opt-in (%s) and Shift+Tab never selects',
  async selectOnTab => {
    const { input, model, selected } = await setup({ selectOnTab })
    await expanded(input)
    await userEvent.keyboard('{ArrowDown}{Tab}')
    expect(model.value).toBe(selectOnTab ? 'status:' : '')
    expect(document.activeElement).toBe(selectOnTab ? input : document.querySelector('button'))
    if (selectOnTab) {
      await userEvent.click(input)
      await userEvent.keyboard('{ArrowDown}{Shift>}{Tab}{/Shift}')
      expect(selected).toHaveBeenCalledTimes(1)
    }
  },
)

it('Tab with no active option still navigates normally', async () => {
  const { input, selected } = await setup({ selectOnTab: true })
  await expanded(input)
  await userEvent.keyboard('{Tab}')
  expect(selected).not.toHaveBeenCalled()
  expect(document.activeElement).toBe(document.querySelector('button'))
})

it('remote replacements drop stale highlight and loading never hides the current text', async () => {
  const { input, options, loading, submit } = await setup({ text: 'sta' })
  await expanded(input)
  await userEvent.keyboard('{ArrowDown}')
  loading.value = true
  options.value = []
  await tick()
  expect(input.getAttribute('aria-busy')).toBe('true')
  expect(input.value).toBe('sta')
  expect(input.hasAttribute('aria-activedescendant')).toBe(false)
  options.value = [{ value: 'server', label: 'server:' }]
  loading.value = false
  await tick()
  await userEvent.keyboard('{Enter}')
  expect(submit).toHaveBeenCalledWith('sta')
})

it.each(['disabled', 'readonly'] as const)('does not open or edit when %s', async state => {
  const { input, open, model } = await setup({ [state]: true, text: 'saved' })
  input.focus()
  input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))
  expect(open.value).toBe(false)
  expect(model.value).toBe('saved')
})

it('keeps keyboard scrolling inside the popup and matches the input width in RTL', async () => {
  const { input, element } = await setup({
    options: Array.from({ length: 40 }, (_, value) => ({ value, label: `Option ${value}` })),
  })
  element.setAttribute('dir', 'rtl')
  await expanded(input)
  const y = window.scrollY
  for (let i = 0; i < 30; i++) await userEvent.keyboard('{ArrowDown}')
  const active = document.getElementById(input.getAttribute('aria-activedescendant')!)!
  const viewport = list()!.closest('[data-overlayscrollbars-viewport]')!
  expect(viewport.scrollTop).toBeGreaterThan(0)
  expect(active.getBoundingClientRect().bottom).toBeLessThanOrEqual(
    viewport.getBoundingClientRect().bottom + 1,
  )
  expect(window.scrollY).toBe(y)
  expect(Math.round(list()!.getBoundingClientRect().width)).toBe(
    Math.round(element.querySelector('[data-hn-autocomplete]')!.getBoundingClientRect().width) - 2,
  )
})

it('integrates FormField labels and descriptions without accessibility violations', async () => {
  const { input, element } = await setup({ field: true })
  await expanded(input)
  expect(input.getAttribute('aria-describedby')).toBeTruthy()
  expect(document.querySelector('label')?.htmlFor).toBe(input.id)
  const result = await axe.run([element, list()!], {
    rules: { region: { enabled: false } },
  })
  expect(result.violations.map(v => `${v.id}: ${v.description}`)).toEqual([])
})

it('keeps the parent dialog open while selecting and dismissing suggestions', async () => {
  const dialogOpen = signal(true)
  const text = signal('draft')
  const host = document.createElement('div')
  document.body.append(host)
  function Harness() {
    const isOpen = dialogOpen.use()
    const value = text.use()
    return (
      <Dialog
        open={isOpen}
        onOpenChange={next => {
          dialogOpen.value = !!next
        }}
        title="Query"
        renderContent={() => (
          <Autocomplete
            value={value}
            onValueChange={next => {
              text.value = next
            }}
            options={initial}
            aria-label="Query input"
          />
        )}
      />
    )
  }
  mounted.push(await render(<Harness />, { container: host }))
  await vi.waitFor(() => expect(document.querySelector('input')).not.toBeNull())
  const input = document.querySelector('input')!
  await expanded(input)
  await userEvent.click(rows()[0]!)
  await vi.waitFor(() => expect(text.value).toBe('status:'))
  expect(dialogOpen.value).toBe(true)
  expect(document.activeElement).toBe(input)
  await userEvent.click(input)
  await userEvent.keyboard('{Escape}')
  expect(input.getAttribute('aria-expanded')).toBe('false')
  expect(dialogOpen.value).toBe(true)
})
