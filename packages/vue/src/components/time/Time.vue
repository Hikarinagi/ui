<script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { devWarn } from '../../lib/dev'
  import { useUiLocale } from '../../locale'
  import { relativeTime } from './utils/relativeTime'
  import { useNow } from './composables/useNow'

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

  const now = useNow(() => props.format === 'relative')

  const absoluteOptions = {
    datetime: { dateStyle: 'medium', timeStyle: 'short' },
    date: { dateStyle: 'medium' },
    time: { timeStyle: 'short' },
  } as const satisfies Record<string, Intl.DateTimeFormatOptions>

  const text = computed(() => {
    if (!date.value) return t.value.time.unknown
    if (props.format === 'relative')
      return relativeTime(date.value, now.value, t.value.tag, t.value.time.justNow)
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
