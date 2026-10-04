import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue'
import { createRipple } from '../../../../shared/src/behavior/ripple'

export function useRipple(
  container: Ref<HTMLElement | null>,
  surface: Ref<HTMLElement | null>,
  isDisabled: () => boolean,
) {
  const pressed = ref(false)
  const ripple = createRipple({
    container: () => container.value,
    surface: () => surface.value,
    disabled: isDisabled,
    onPressedChange: value => {
      pressed.value = value
    },
  })

  onMounted(ripple.connect)
  onBeforeUnmount(ripple.disconnect)

  return { pressed }
}
