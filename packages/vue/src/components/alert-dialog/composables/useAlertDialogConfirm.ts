import { ref, type Ref } from 'vue'

export function useAlertDialogConfirm(
  props: { onConfirm?: () => unknown },
  open: Ref<boolean | undefined>,
  onError: (error: unknown) => void,
  blocked: () => boolean = () => false,
) {
  const busy = ref(false)

  function guard(event: Event) {
    if (busy.value) event.preventDefault()
  }

  async function confirm() {
    if (!open.value || busy.value || blocked()) return
    busy.value = true
    try {
      await props.onConfirm?.()
      open.value = false
    } catch (error) {
      onError(error)
    } finally {
      busy.value = false
    }
  }

  return { busy, guard, confirm }
}
