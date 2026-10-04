'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useControllableState } from 'radix-ui/internal'
import type { StepperItem, StepperNavigation, StepperProps, StepperSlotProps } from '../types'

type StepperOptions<T extends StepperItem> = Pick<
  StepperProps<T>,
  'items' | 'value' | 'defaultValue' | 'linear' | 'disabled' | 'beforeChange'
>

export function useStepper<T extends StepperItem>(
  props: StepperOptions<T>,
  update: (step: number) => void,
  onError: (error: unknown) => void,
) {
  const [model, setModel] = useControllableState<number | undefined>({
    prop: props.value,
    defaultProp: props.defaultValue ?? 1,
    onChange: value => update(value!),
    caller: 'Stepper',
  })
  const [pending, setPendingState] = useState(false)
  const total = props.items.length
  const step = total
    ? Math.min(total, Math.max(1, Math.floor(Number.isFinite(model) ? model! : 1)))
    : 0

  const store = useRef({ version: 0, pending: false })
  const setPending = useCallback((value: boolean) => {
    store.current.pending = value
    setPendingState(value)
  }, [])
  const invalidate = useCallback(() => {
    store.current.version++
    setPending(false)
  }, [setPending])

  const watched = [
    model,
    JSON.stringify(props.items.map(item => [item.title, !!item.disabled])),
    props.disabled,
    props.linear,
    props.beforeChange,
  ]
  const seen = useRef(watched)
  if (watched.some((value, index) => !Object.is(value, seen.current[index]))) {
    seen.current = watched
    store.current.version++
    store.current.pending = false
    if (pending) setPendingState(false)
  }
  useEffect(() => invalidate, [invalidate])

  const latest = useRef({ props, step, total, setModel, onError })
  latest.current = { props, step, total, setModel, onError }

  const available = useCallback((target: number) => {
    const { props, step, total } = latest.current
    return (
      Number.isInteger(target) &&
      target >= 1 &&
      target <= total &&
      !props.disabled &&
      !props.items[target - 1]?.disabled &&
      (props.linear === false || target <= step + 1)
    )
  }, [])

  const goTo = useCallback(
    async (target: number) => {
      if (store.current.pending || !available(target) || target === latest.current.step)
        return false
      const ticket = ++store.current.version
      const from = latest.current.step
      try {
        const { beforeChange } = latest.current.props
        if (beforeChange) {
          setPending(true)
          const allowed = await beforeChange(target, from)
          if (allowed === false) return false
        }
        if (ticket !== store.current.version || from !== latest.current.step || !available(target))
          return false
        setPending(false)
        latest.current.setModel(target)
        return true
      } catch (error) {
        if (ticket === store.current.version) latest.current.onError(error)
        return false
      } finally {
        if (ticket === store.current.version) setPending(false)
      }
    },
    [available, setPending],
  )

  const next = useCallback(() => goTo(latest.current.step + 1), [goTo])
  const prev = useCallback(() => goTo(latest.current.step - 1), [goTo])
  const canNext = !pending && step > 0 && available(step + 1)
  const canPrev = !pending && available(step - 1)
  const entries: StepperSlotProps<T>[] = props.items.map((item, index) => ({
    item,
    index,
    step: index + 1,
    active: step === index + 1,
    pending: pending && step === index + 1,
    disabled: !available(index + 1),
    state: item.error
      ? 'error'
      : item.completed || index + 1 < step
        ? 'completed'
        : index + 1 === step
          ? 'active'
          : 'inactive',
  }))
  const navigation: StepperNavigation<T> = {
    step,
    item: props.items[step - 1],
    total,
    pending,
    canNext,
    canPrev,
    next,
    prev,
    goTo,
  }

  return { step, pending, entries, navigation, next, prev, goTo, canNext, canPrev, store }
}
