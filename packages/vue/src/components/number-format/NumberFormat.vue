<script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { devWarn } from '../../lib/dev'
  import { useUiLocale } from '../../locale'

  defineOptions({ name: 'HnNumberFormat' })

  const props = withDefaults(
    defineProps<{
      value?: number | null
      format?: 'decimal' | 'compact' | 'percent' | 'currency'
      currency?: string
      precision?: number
      class?: string
    }>(),
    { format: 'decimal' },
  )

  const t = useUiLocale()

  const valid = computed(() => typeof props.value === 'number' && Number.isFinite(props.value))

  const text = computed(() => {
    if (!valid.value) return '—'
    const options: Intl.NumberFormatOptions = {}
    if (props.format === 'compact') options.notation = 'compact'
    if (props.format === 'percent') options.style = 'percent'
    if (props.format === 'currency') {
      if (props.currency) {
        options.style = 'currency'
        options.currency = props.currency
      } else {
        devWarn('NumberFormat', 'currency 档需要 currency 代码,已退回 decimal')
      }
    }
    if (props.precision != null) options.maximumFractionDigits = props.precision
    return new Intl.NumberFormat(t.value.tag, options).format(props.value as number)
  })

  const full = computed(() =>
    valid.value && props.format === 'compact'
      ? new Intl.NumberFormat(t.value.tag).format(props.value as number)
      : undefined,
  )
</script>

<template>
  <span :title="full" :class="cn(props.class)">{{ text }}</span>
</template>
