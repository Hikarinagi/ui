import { computed } from 'vue'
import type { PrimitiveProps } from 'reka-ui'

export function useChipRoot(props: PrimitiveProps & { selectable?: boolean; disabled?: boolean }) {
  const tag = computed(() => props.as ?? (props.selectable ? 'button' : 'span'))
  const nativeButton = computed(() => tag.value === 'button' && !props.asChild)
  const interactive = computed(
    () => !!props.selectable || tag.value === 'button' || tag.value === 'a' || !!props.asChild,
  )

  const attrs = computed(() => {
    if (nativeButton.value) return { type: 'button', disabled: props.disabled }
    if (interactive.value && props.disabled) {
      return { 'data-disabled': '', 'aria-disabled': 'true', tabindex: -1 }
    }
    return props.disabled ? { 'data-disabled': '' } : undefined
  })

  return { tag, interactive, attrs }
}
