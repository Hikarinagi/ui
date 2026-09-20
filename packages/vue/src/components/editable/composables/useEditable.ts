import { computed, nextTick, onBeforeUnmount, shallowRef, watch, type Ref } from 'vue'
import type { EditableProps } from '../types'

export function useEditable(config: {
  props: EditableProps
  model: Ref<string>
  editing: Ref<boolean>
  input: Ref<HTMLInputElement | HTMLTextAreaElement | undefined>
  disabled: () => boolean
  failureMessage: () => string
  requiredMessage: () => string
  onEdit: () => void
  onSubmit: (value: string, previousValue: string) => void
  onCancel: (draft: string) => void
  onError: (error: unknown) => void
}) {
  const { props, model, editing, input } = config
  const root = shallowRef<HTMLElement>()
  const preview = shallowRef<HTMLElement>()
  const draft = shallowRef(model.value)
  const error = shallowRef('')
  const saving = shallowRef(false)
  const blocked = computed(() => config.disabled() || !!props.readonly)
  const dirty = computed(() => draft.value !== model.value)
  let revision = 0
  let composing = false

  function invalidate() {
    revision++
    saving.value = false
    error.value = ''
  }

  function focus(select = false) {
    if (!editing.value || blocked.value) return
    input.value?.focus({ preventScroll: true })
    if (select) input.value?.select()
  }

  function edit() {
    if (editing.value || blocked.value) return
    editing.value = true
  }

  async function finish(restoreFocus: boolean) {
    const active = root.value?.ownerDocument.activeElement
    const restore = restoreFocus && !!active && !!root.value?.contains(active)
    editing.value = false
    await nextTick()
    if (restore && !editing.value && !blocked.value) preview.value?.focus({ preventScroll: true })
  }

  function cancel() {
    if (!editing.value || saving.value) return
    const abandoned = draft.value
    invalidate()
    draft.value = model.value
    void finish(true)
    config.onCancel(abandoned)
  }

  async function submit(restoreFocus = true) {
    if (!editing.value || blocked.value || saving.value || composing) return false
    if (input.value && !input.value.checkValidity()) {
      error.value = input.value.validity.valueMissing
        ? config.requiredMessage()
        : input.value.validationMessage
      return false
    }
    error.value = ''
    const value = draft.value
    const previous = model.value
    if (value === previous) {
      await finish(restoreFocus)
      return true
    }
    const current = ++revision
    saving.value = true
    try {
      await props.onSave?.(value, previous)
      if (current !== revision || !editing.value || blocked.value) return false
      void finish(restoreFocus)
      model.value = value
      draft.value = value
      config.onSubmit(value, previous)
      return true
    } catch (cause) {
      if (current !== revision) return false
      error.value =
        cause instanceof Error && cause.message ? cause.message : config.failureMessage()
      config.onError(cause)
      return false
    } finally {
      if (current === revision) saving.value = false
    }
  }

  function onInput(event: Event) {
    if (saving.value || blocked.value) return
    draft.value = (event.target as HTMLInputElement).value
    error.value = ''
  }

  function onFocusout(event: FocusEvent) {
    if (event.relatedTarget instanceof Node && root.value?.contains(event.relatedTarget)) return
    void nextTick(() => {
      if (root.value?.contains(root.value.ownerDocument.activeElement)) return
      if (props.submitMode === 'blur' || props.submitMode === 'both') void submit(false)
    })
  }

  function onKeydown(event: KeyboardEvent) {
    if (!editing.value || event.defaultPrevented) return
    if (composing || event.isComposing || event.keyCode === 229) {
      if (event.key === 'Escape') event.stopPropagation()
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      cancel()
      return
    }
    if (event.target !== input.value || event.key !== 'Enter') return
    if (props.multiline && !(event.ctrlKey || event.metaKey)) return
    event.preventDefault()
    if (props.submitMode === 'enter' || props.submitMode === 'both') void submit()
  }

  watch(
    editing,
    value => {
      invalidate()
      draft.value = model.value
      composing = false
      if (value) {
        if (blocked.value) {
          editing.value = false
          return
        }
        config.onEdit()
      }
    },
    { flush: 'sync' },
  )
  watch(
    editing,
    value => {
      if (value) focus(props.selectOnFocus)
    },
    { flush: 'post' },
  )
  watch(
    model,
    value => {
      invalidate()
      draft.value = value
      if (editing.value) void finish(false)
    },
    { flush: 'sync' },
  )
  watch(
    blocked,
    value => {
      if (value && editing.value) {
        invalidate()
        draft.value = model.value
        void finish(false)
      }
    },
    { flush: 'sync' },
  )
  onBeforeUnmount(invalidate)

  return {
    root,
    input,
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
      composing = true
    },
    onCompositionEnd: () => {
      composing = false
    },
  }
}
