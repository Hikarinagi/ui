import { ref, watch } from 'vue'
import { usePaginationContext } from '../context'

export function usePaginationJump() {
  const context = usePaginationContext()
  const draft = ref(String(context.state.value.page))
  const reset = () => {
    draft.value = String(context.state.value.page)
  }
  watch(() => context.state.value.page, reset)
  watch(context.blocked, blocked => {
    if (blocked) reset()
  })
  function commit() {
    if (context.blocked.value) return reset()
    const value = Number(draft.value.trim())
    if (!draft.value.trim() || !Number.isFinite(value)) return reset()
    const next = Math.min(context.state.value.pageCount, Math.max(1, Math.trunc(value)))
    draft.value = String(next)
    context.update(next)
  }
  return { draft, commit, reset, size: context.size, blocked: context.blocked }
}
