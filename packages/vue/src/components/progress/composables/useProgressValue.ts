import { computed, toValue, type MaybeRefOrGetter } from 'vue'
import { useUiLocale } from '../../../locale'

export type ProgressFormat = (value: number, max: number) => string

interface Options {
  value: MaybeRefOrGetter<number | null | undefined>
  max: MaybeRefOrGetter<number>
  label: MaybeRefOrGetter<string | undefined>
  format: MaybeRefOrGetter<ProgressFormat | undefined>
}

export function useProgressValue(options: Options) {
  const t = useUiLocale()

  const current = computed(() => {
    const value = toValue(options.value)
    if (typeof value !== 'number') return null
    return Math.min(Math.max(value, 0), toValue(options.max))
  })

  const ratio = computed(() => {
    const max = toValue(options.max)
    return current.value === null || max <= 0 ? 0 : current.value / max
  })

  const text = computed(() => {
    if (current.value === null) return undefined
    const format = toValue(options.format)
    if (format) return format(current.value, toValue(options.max))
    return new Intl.NumberFormat(t.value.tag, {
      style: 'percent',
      maximumFractionDigits: 0,
    }).format(ratio.value)
  })

  const name = computed(() => toValue(options.label) ?? text.value ?? t.value.common.loading)

  return { current, ratio, text, name }
}
