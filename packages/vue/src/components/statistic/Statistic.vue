<script setup lang="ts">
  import { TrendingDown, TrendingUp } from '@lucide/vue'
  import { computed, useSlots } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import NumberFormat from '../number-format/NumberFormat.vue'
  import Skeleton from '../skeleton/Skeleton.vue'
  import {
    statistic,
    statisticAffix,
    statisticBody,
    statisticDelta,
    statisticIcon,
    statisticLabel,
    statisticValue,
    type StatisticVariants,
  } from './statistic.variants'

  defineOptions({ name: 'HnStatistic' })

  const props = withDefaults(
    defineProps<{
      label: string
      value?: number | string | null
      format?: 'decimal' | 'compact' | 'percent' | 'currency'
      currency?: string
      precision?: number
      prefix?: string
      suffix?: string
      delta?: number
      deltaLabel?: string
      invert?: boolean
      loading?: boolean
      size?: StatisticVariants['size']
      class?: string
    }>(),
    { format: 'decimal', invert: false, loading: false, size: 'md' },
  )

  const slots = useSlots()
  const t = useUiLocale()

  const deltaText = computed(() => {
    if (props.delta === undefined) return undefined
    return new Intl.NumberFormat(t.value.tag, {
      style: 'percent',
      maximumFractionDigits: 1,
      signDisplay: 'exceptZero',
    }).format(props.delta)
  })

  const deltaTone = computed(() => {
    if (!props.delta) return 'neutral'
    return props.delta > 0 !== props.invert ? 'success' : 'danger'
  })
</script>

<template>
  <div data-hn-statistic :class="cn(statistic(), props.class)">
    <div :class="statisticBody()">
      <span :class="statisticLabel()">{{ props.label }}</span>
      <span :class="statisticValue({ size: props.size })">
        <Skeleton v-if="props.loading" class="h-[1.25em] w-24" />
        <template v-else>
          <span v-if="props.prefix" :class="statisticAffix()">{{ props.prefix }}</span>
          <NumberFormat
            v-if="typeof props.value === 'number'"
            :value="props.value"
            :format="props.format"
            :currency="props.currency"
            :precision="props.precision"
          />
          <span v-else>{{ props.value ?? '—' }}</span>
          <span v-if="props.suffix" :class="statisticAffix()">{{ props.suffix }}</span>
        </template>
      </span>
      <span v-if="deltaText" :class="statisticDelta({ tone: deltaTone })">
        <Skeleton v-if="props.loading" class="h-[1.25em] w-16" />
        <template v-else>
          <TrendingUp v-if="props.delta! > 0" aria-hidden="true" />
          <TrendingDown v-else-if="props.delta! < 0" aria-hidden="true" />
          <span>{{ deltaText }}</span>
          <span v-if="props.deltaLabel" class="text-muted">{{ props.deltaLabel }}</span>
        </template>
      </span>
      <slot />
    </div>
    <span v-if="slots.icon" aria-hidden="true" :class="statisticIcon()">
      <slot name="icon" />
    </span>
  </div>
</template>
