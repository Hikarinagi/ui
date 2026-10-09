import {
  computed,
  inject,
  onScopeDispose,
  provide,
  shallowRef,
  watch,
  type ComputedRef,
  type InjectionKey,
  type Ref,
} from 'vue'

interface FormScope {
  set: (id: symbol, submitting: boolean) => void
}

const FORM_SCOPE_KEY = Symbol('hn-form-scope') as InjectionKey<FormScope>

export function provideFormScope(): ComputedRef<boolean> {
  const active = shallowRef<ReadonlySet<symbol>>(new Set())
  provide(FORM_SCOPE_KEY, {
    set(id, submitting) {
      if (active.value.has(id) === submitting) return
      const next = new Set(active.value)
      if (submitting) next.add(id)
      else next.delete(id)
      active.value = next
    },
  })
  return computed(() => active.value.size > 0)
}

export function reportFormScope(submitting: Ref<boolean>) {
  const scope = inject(FORM_SCOPE_KEY, null)
  if (!scope) return
  const id = Symbol('form')
  watch(submitting, value => scope.set(id, value), { immediate: true, flush: 'sync' })
  onScopeDispose(() => scope.set(id, false))
}
