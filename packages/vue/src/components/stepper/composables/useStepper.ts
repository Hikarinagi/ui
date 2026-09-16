import { useVModel } from '@vueuse/core'
import { computed, onScopeDispose, ref, watch } from 'vue'
import type { StepperItem, StepperNavigation, StepperProps, StepperSlotProps } from '../types'

export function useStepper<T extends StepperItem>(
  props: StepperProps<T>,
  update: (step: number) => void,
  onError: (error: unknown) => void,
) {
  const model = useVModel(props, 'modelValue', (_, value) => update(value!), {
    defaultValue: props.defaultValue ?? 1,
    passive: (props.modelValue === undefined) as false,
  })
  const pending = ref(false)
  const total = computed(() => props.items.length)
  const step = computed(() =>
    total.value
      ? Math.min(
          total.value,
          Math.max(1, Math.floor(Number.isFinite(model.value) ? model.value! : 1)),
        )
      : 0,
  )
  let version = 0

  function invalidate() {
    version++
    pending.value = false
  }

  watch(
    [
      model,
      () => JSON.stringify(props.items.map(item => [item.title, !!item.disabled])),
      () => props.disabled,
      () => props.linear,
      () => props.beforeChange,
    ],
    invalidate,
    { flush: 'sync' },
  )
  onScopeDispose(invalidate)

  function available(target: number) {
    return (
      Number.isInteger(target) &&
      target >= 1 &&
      target <= total.value &&
      !props.disabled &&
      !props.items[target - 1]?.disabled &&
      (props.linear === false || target <= step.value + 1)
    )
  }

  const canNext = computed(() => !pending.value && step.value > 0 && available(step.value + 1))
  const canPrev = computed(() => !pending.value && available(step.value - 1))

  async function goTo(target: number) {
    if (pending.value || !available(target) || target === step.value) return false
    const ticket = ++version
    const from = step.value
    try {
      if (props.beforeChange) {
        pending.value = true
        const allowed = await props.beforeChange(target, from)
        if (allowed === false) return false
      }
      if (ticket !== version || from !== step.value || !available(target)) return false
      pending.value = false
      model.value = target
      return true
    } catch (error) {
      if (ticket === version) onError(error)
      return false
    } finally {
      if (ticket === version) pending.value = false
    }
  }

  const next = () => goTo(step.value + 1)
  const prev = () => goTo(step.value - 1)
  const entries = computed<StepperSlotProps<T>[]>(() =>
    props.items.map((item, index) => ({
      item,
      index,
      step: index + 1,
      active: step.value === index + 1,
      pending: pending.value && step.value === index + 1,
      disabled: !available(index + 1),
      state: item.error
        ? 'error'
        : item.completed || index + 1 < step.value
          ? 'completed'
          : index + 1 === step.value
            ? 'active'
            : 'inactive',
    })),
  )
  const navigation = computed<StepperNavigation<T>>(() => ({
    step: step.value,
    item: props.items[step.value - 1],
    total: total.value,
    pending: pending.value,
    canNext: canNext.value,
    canPrev: canPrev.value,
    next,
    prev,
    goTo,
  }))

  return { step, pending, entries, navigation, next, prev, goTo, canNext, canPrev }
}
