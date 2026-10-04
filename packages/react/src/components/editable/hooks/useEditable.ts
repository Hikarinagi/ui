'use client'

import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState,
  type ChangeEvent,
  type FocusEvent,
  type KeyboardEvent,
} from 'react'
import type { EditableSubmitMode, EditableSave } from '../types'

type TextControl = HTMLInputElement | HTMLTextAreaElement

interface Config {
  model: string
  setModel: (value: string) => void
  editing: boolean
  setEditing: (value: boolean) => void
  submitMode: EditableSubmitMode
  selectOnFocus: boolean
  multiline: boolean
  readonly: boolean
  onSave: EditableSave | undefined
  input: () => TextControl | undefined
  disabled: boolean
  failureMessage: string
  requiredMessage: string
  onEdit: () => void
  onSubmit: (value: string, previousValue: string) => void
  onCancel: (draft: string) => void
  onError: (error: unknown) => void
}

interface PendingFinish {
  restore: boolean
  resolve: () => void
}

function useChanged<T>(value: T, effect: (value: T) => void) {
  const previous = useRef(value)
  const latest = useRef(effect)
  latest.current = effect
  useLayoutEffect(() => {
    if (Object.is(previous.current, value)) return
    previous.current = value
    latest.current(value)
  }, [value])
}

export function useEditable(config: Config) {
  const root = useRef<HTMLElement | null>(null)
  const preview = useRef<HTMLElement | null>(null)
  const [draft, setDraftState] = useState(config.model)
  const [error, setErrorState] = useState('')
  const [saving, setSavingState] = useState(false)
  const [, flush] = useReducer((count: number) => count + 1, 0)
  const blocked = config.disabled || config.readonly
  const dirty = draft !== config.model

  const state = useRef({ draft, error, saving })
  const latest = useRef({ ...config, blocked })
  latest.current = { ...config, blocked }
  const revision = useRef(0)
  const composing = useRef(false)
  const pending = useRef<PendingFinish[]>([])

  function setDraft(value: string) {
    state.current.draft = value
    setDraftState(value)
  }

  function setError(value: string) {
    state.current.error = value
    setErrorState(value)
  }

  function setSaving(value: boolean) {
    state.current.saving = value
    setSavingState(value)
  }

  function invalidate() {
    revision.current++
    setSaving(false)
    setError('')
  }

  function focus(select = false) {
    if (!latest.current.editing || latest.current.blocked) return
    const input = latest.current.input()
    input?.focus({ preventScroll: true })
    if (select) input?.select()
  }

  function edit() {
    if (latest.current.editing || latest.current.blocked) return
    latest.current.setEditing(true)
  }

  function finish(restoreFocus: boolean) {
    const element = root.current
    const active = element?.ownerDocument.activeElement
    const restore = restoreFocus && !!active && !!element?.contains(active)
    latest.current.setEditing(false)
    return new Promise<void>(resolve => {
      pending.current.push({ restore, resolve })
      flush()
    })
  }

  function cancel() {
    if (!latest.current.editing || state.current.saving) return
    const abandoned = state.current.draft
    invalidate()
    setDraft(latest.current.model)
    void finish(true)
    latest.current.onCancel(abandoned)
  }

  async function submit(restoreFocus = true) {
    const config = latest.current
    if (!config.editing || config.blocked || state.current.saving || composing.current) return false
    const input = config.input()
    if (input && !input.checkValidity()) {
      setError(input.validity.valueMissing ? config.requiredMessage : input.validationMessage)
      return false
    }
    setError('')
    const value = state.current.draft
    const previous = config.model
    if (value === previous) {
      await finish(restoreFocus)
      return true
    }
    const current = ++revision.current
    setSaving(true)
    try {
      await config.onSave?.(value, previous)
      if (current !== revision.current || !latest.current.editing || latest.current.blocked)
        return false
      void finish(restoreFocus)
      latest.current.setModel(value)
      setDraft(value)
      latest.current.onSubmit(value, previous)
      return true
    } catch (cause) {
      if (current !== revision.current) return false
      setError(
        cause instanceof Error && cause.message ? cause.message : latest.current.failureMessage,
      )
      latest.current.onError(cause)
      return false
    } finally {
      if (current === revision.current) setSaving(false)
    }
  }

  function onInput(event: ChangeEvent<TextControl>) {
    if (state.current.saving || latest.current.blocked) return
    setDraft(event.target.value)
    setError('')
  }

  function onFocusout(event: FocusEvent<HTMLElement>) {
    if (event.relatedTarget instanceof Node && root.current?.contains(event.relatedTarget)) return
    void Promise.resolve().then(() => {
      const element = root.current
      if (element?.contains(element.ownerDocument.activeElement)) return
      const mode = latest.current.submitMode
      if (mode === 'blur' || mode === 'both') void submit(false)
    })
  }

  function onKeydown(event: KeyboardEvent<HTMLElement>) {
    if (!latest.current.editing || event.defaultPrevented) return
    if (composing.current || event.nativeEvent.isComposing || event.keyCode === 229) return
    if (event.key === 'Escape') return
    if (event.target !== latest.current.input() || event.key !== 'Enter') return
    if (latest.current.multiline && !(event.ctrlKey || event.metaKey)) return
    event.preventDefault()
    const mode = latest.current.submitMode
    if (mode === 'enter' || mode === 'both') void submit()
  }

  useEffect(() => {
    if (!config.editing) return
    function onEscape(event: globalThis.KeyboardEvent) {
      if (event.key !== 'Escape') return
      const element = root.current
      if (!element || !(event.target instanceof Node) || !element.contains(event.target)) return
      if (!latest.current.editing || event.defaultPrevented) return
      if (composing.current || event.isComposing || event.keyCode === 229) {
        event.stopPropagation()
        return
      }
      event.preventDefault()
      event.stopPropagation()
      cancel()
    }
    window.addEventListener('keydown', onEscape, true)
    return () => window.removeEventListener('keydown', onEscape, true)
  }, [config.editing])

  useChanged(config.editing, value => {
    invalidate()
    setDraft(latest.current.model)
    composing.current = false
    if (value) {
      if (latest.current.blocked) {
        latest.current.setEditing(false)
        return
      }
      latest.current.onEdit()
    }
  })

  useChanged(config.editing, value => {
    if (value) focus(latest.current.selectOnFocus)
  })

  useChanged(config.model, value => {
    invalidate()
    setDraft(value)
    if (latest.current.editing) void finish(false)
  })

  useChanged(blocked, value => {
    if (value && latest.current.editing) {
      invalidate()
      setDraft(latest.current.model)
      void finish(false)
    }
  })

  useLayoutEffect(() => {
    if (!pending.current.length) return
    const settled = pending.current.splice(0)
    const { editing, blocked } = latest.current
    for (const { restore, resolve } of settled) {
      if (restore && !editing && !blocked) preview.current?.focus({ preventScroll: true })
      resolve()
    }
  })

  useEffect(
    () => () => {
      revision.current++
      state.current.saving = false
    },
    [],
  )

  return {
    root,
    preview,
    draft,
    error,
    saving,
    blocked,
    dirty,
    edit,
    submit,
    cancel,
    focus,
    onInput,
    onFocusout,
    onKeydown,
    onCompositionStart: () => {
      composing.current = true
    },
    onCompositionEnd: () => {
      composing.current = false
    },
    state,
  }
}
