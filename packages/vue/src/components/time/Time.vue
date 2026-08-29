<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { cn } from '../../lib/cn'
  import { devWarn } from '../../lib/dev'
  import { useUiLocale } from '../../locale'

  defineOptions({ name: 'HnTime' })

  const props = withDefaults(
    defineProps<{
      value?: string | number | Date | null
      format?: 'datetime' | 'date' | 'time' | 'relative'
      class?: string
    }>(),
    { format: 'datetime' },
  )

  const t = useUiLocale()

  const date = computed(() => {
    if (props.value == null || props.value === '') return null
    const parsed = new Date(props.value)
    if (Number.isNaN(parsed.getTime())) {
      devWarn('Time', `value 无法解析为时间:${String(props.value)}`, String(props.value))
      return null
    }
    return parsed
  })

  const now = ref(Date.now())
  let timer: ReturnType<typeof setInterval> | undefined

  onMounted(() => {
    watch(
      () => props.format,
      format => {
        clearInterval(timer)
        timer = undefined
        if (format === 'relative') {
          now.value = Date.now()
          timer = setInterval(() => {
            now.value = Date.now()
          }, 30_000)
        }
      },
      { immediate: true },
    )
  })

  onBeforeUnmount(() => clearInterval(timer))

  const DIVISIONS = [
    [60, 'second'],
    [60, 'minute'],
    [24, 'hour'],
    [7, 'day'],
    [4.34524, 'week'],
    [12, 'month'],
    [Infinity, 'year'],
  ] as const

  function relativeText(target: Date, nowMs: number) {
    let duration = (target.getTime() - nowMs) / 1000
    if (Math.abs(duration) < 45) return t.value.time.justNow
    const rtf = new Intl.RelativeTimeFormat(t.value.tag, { numeric: 'auto' })
    for (const [amount, unit] of DIVISIONS) {
      if (Math.abs(duration) < amount) return rtf.format(Math.round(duration), unit)
      duration /= amount
    }
    return ''
  }

  const absoluteOptions = {
    datetime: { dateStyle: 'medium', timeStyle: 'short' },
    date: { dateStyle: 'medium' },
    time: { timeStyle: 'short' },
  } as const satisfies Record<string, Intl.DateTimeFormatOptions>

  const text = computed(() => {
    if (!date.value) return t.value.time.unknown
    if (props.format === 'relative') return relativeText(date.value, now.value)
    return new Intl.DateTimeFormat(t.value.tag, absoluteOptions[props.format]).format(date.value)
  })

  const absolute = computed(() =>
    date.value
      ? new Intl.DateTimeFormat(t.value.tag, absoluteOptions.datetime).format(date.value)
      : undefined,
  )
</script>

<template>
  <time
    v-if="date"
    :datetime="date.toISOString()"
    :title="format === 'relative' ? absolute : undefined"
    :class="cn(props.class)"
  >
    {{ text }}
  </time>
  <span v-else :class="cn(props.class)">{{ text }}</span>
</template>
