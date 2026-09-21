import { computed, nextTick, shallowRef, useId, watch, type Ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import { applyCompletion } from '@hina-ui/shared/lib/completion'
import type {
  AutocompleteOption,
  AutocompleteSelection,
  CompletionContext,
  CompletionEdit,
} from '../types'

export function useAutocomplete<T extends AutocompleteOption>(config: {
  options: () => readonly T[]
  model: Ref<string>
  open: Ref<boolean>
  disabled: () => boolean
  readonly: () => boolean | undefined
  selectOnTab: () => boolean | undefined
  getCompletion: () => ((option: T, context: CompletionContext) => CompletionEdit) | undefined
  onQuery: (context: CompletionContext) => void
  onSelect: (selection: AutocompleteSelection<T>) => void
  onSubmit: (text: string) => void
  onClear: () => void
}) {
  const input = shallowRef<HTMLInputElement>()
  const host = shallowRef<HTMLElement>()
  const scroll = shallowRef<{ viewport: HTMLElement | undefined }>()
  const active = shallowRef<string | number>()
  const composing = shallowRef(false)
  const listId = `hn-autocomplete-${useId()}`
  const blocked = computed(() => config.disabled() || !!config.readonly())
  const visible = computed({
    get: () => config.open.value && !blocked.value,
    set: value => {
      config.open.value = value
    },
  })
  const activeIndex = computed(() =>
    config.options().findIndex(option => option.value === active.value && !option.disabled),
  )
  const optionId = (index: number) => `${listId}-${index}`
  const activeId = computed(() =>
    visible.value && activeIndex.value >= 0 ? optionId(activeIndex.value) : undefined,
  )
  let lastQuery = ''
  let revision = 0
  let restoringFocus = false

  function context(): CompletionContext {
    const text = input.value?.value ?? config.model.value
    return {
      text,
      selectionStart: input.value?.selectionStart ?? text.length,
      selectionEnd: input.value?.selectionEnd ?? text.length,
    }
  }

  function query(force = false) {
    if (blocked.value || composing.value) return false
    const value = context()
    const signature = JSON.stringify(value)
    if (!force && signature === lastQuery) return false
    lastQuery = signature
    active.value = undefined
    config.onQuery(value)
    return true
  }

  function show() {
    if (blocked.value || composing.value || restoringFocus) return
    const reopening = !visible.value
    visible.value = true
    query(reopening)
  }

  function onInput() {
    revision++
    config.model.value = input.value?.value ?? ''
    active.value = undefined
    if (composing.value) return
    visible.value = true
    query()
  }

  function onCompositionEnd() {
    composing.value = false
    onInput()
  }

  function onBlur() {
    revision++
    visible.value = false
  }

  useEventListener(
    () => input.value?.ownerDocument,
    'selectionchange',
    () => {
      if (input.value?.ownerDocument.activeElement !== input.value || composing.value) return
      if (query()) visible.value = true
    },
  )

  async function select(option: T) {
    if (blocked.value || composing.value || !visible.value || option.disabled) return
    const before = context()
    const edit = config.getCompletion()?.(option, before) ?? {
      range: [0, before.text.length],
      text: option.label,
    }
    const after = applyCompletion(before, edit)
    const current = ++revision
    config.model.value = after.text
    active.value = undefined
    visible.value = !!edit.keepOpen
    lastQuery = JSON.stringify(after)
    config.onSelect({ option, context: before, edit })
    await nextTick()
    if (current !== revision || !input.value || blocked.value || input.value.value !== after.text)
      return
    restoringFocus = true
    input.value.focus({ preventScroll: true })
    restoringFocus = false
    input.value.setSelectionRange(after.selectionStart, after.selectionEnd)
    query(true)
  }

  async function move(direction: number) {
    visible.value = true
    await nextTick()
    if (!visible.value || blocked.value) return
    const options = config.options()
    let index = activeIndex.value
    if (index < 0) index = direction > 0 ? -1 : options.length
    for (let step = 0; step < options.length; step++) {
      index = (index + direction + options.length) % options.length
      if (!options[index]!.disabled) {
        active.value = options[index]!.value
        break
      }
    }
    await nextTick()
    const row = activeId.value ? input.value?.ownerDocument.getElementById(activeId.value) : null
    const viewport = scroll.value?.viewport
    if (!row || !viewport) return
    const bounds = row.getBoundingClientRect()
    const frame = viewport.getBoundingClientRect()
    if (bounds.top < frame.top) viewport.scrollTop -= frame.top - bounds.top
    else if (bounds.bottom > frame.bottom) viewport.scrollTop += bounds.bottom - frame.bottom
  }

  function onKeydown(event: KeyboardEvent) {
    if (
      blocked.value ||
      composing.value ||
      event.isComposing ||
      event.keyCode === 229 ||
      event.defaultPrevented
    )
      return
    if (event.ctrlKey || event.metaKey || event.altKey) return
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      if (!visible.value) query(true)
      void move(event.key === 'ArrowDown' ? 1 : -1)
    } else if (
      event.key === 'Enter' ||
      (event.key === 'Tab' && !event.shiftKey && config.selectOnTab())
    ) {
      const option = visible.value ? config.options()[activeIndex.value] : undefined
      if (option) {
        event.preventDefault()
        void select(option)
      } else if (event.key === 'Enter') {
        event.preventDefault()
        visible.value = false
        config.onSubmit(config.model.value)
      }
    } else if (event.key === 'Escape') {
      if (!visible.value && !config.model.value) return
      event.preventDefault()
      event.stopPropagation()
      if (visible.value) visible.value = false
      else {
        config.model.value = ''
        lastQuery = JSON.stringify({ text: '', selectionStart: 0, selectionEnd: 0 })
        config.onClear()
        config.onQuery({ text: '', selectionStart: 0, selectionEnd: 0 })
      }
    }
  }

  function highlight(option: T, event: PointerEvent) {
    if (event.pointerType === 'touch' || !visible.value || option.disabled) return
    active.value = option.value
  }

  watch(
    () => config.options(),
    () => {
      active.value = undefined
    },
  )
  watch(visible, value => {
    if (!value) active.value = undefined
  })
  watch(activeIndex, value => {
    if (value < 0) active.value = undefined
  })
  watch(blocked, value => {
    if (value) visible.value = false
  })

  return {
    input,
    host,
    scroll,
    listId,
    optionId,
    active,
    activeId,
    visible,
    composing,
    show,
    onInput,
    onBlur,
    onCompositionEnd,
    onKeydown,
    select,
    highlight,
  }
}
