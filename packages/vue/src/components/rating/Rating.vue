<script setup lang="ts">
  import { RatingItem, RatingItemIndicator, RatingRoot } from 'reka-ui'
  import { Star } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import {
    ratingFill,
    ratingItem,
    ratingRoot,
    ratingStar,
    ratingStep,
    type RatingVariants,
  } from './rating.variants'
  import { starFill } from './utils/fill'

  defineOptions({ name: 'HnRating', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      max?: number
      step?: 1 | 0.5
      clearable?: boolean
      readonly?: boolean
      name?: string
      size?: RatingVariants['size']
      disabled?: boolean
      class?: string
    }>(),
    { max: 5, step: 1, clearable: true },
  )

  const model = defineModel<number>({ default: 0 })

  const t = useUiLocale()
</script>

<template>
  <span
    v-if="props.readonly"
    v-bind="$attrs"
    data-hn-rating
    data-readonly
    role="img"
    :aria-label="t.rating.label(model, props.max)"
    :class="cn(ratingRoot({ size: props.size }), props.class)"
  >
    <span v-for="index in props.max" :key="index" :class="ratingItem()">
      <Star :class="ratingStar()" />
      <span :class="ratingFill()" :style="{ width: starFill(model, index) }">
        <Star :class="ratingStar({ active: true })" />
      </span>
    </span>
  </span>
  <RatingRoot
    v-else
    v-slot="{ items }"
    v-bind="$attrs"
    data-hn-rating
    :data-disabled="props.disabled ? '' : undefined"
    :model-value="model"
    :length="props.max"
    :step="props.step"
    :clearable="props.clearable"
    hoverable
    :disabled="props.disabled"
    :name="props.name"
    :class="cn(ratingRoot({ size: props.size }), props.class)"
    @update:model-value="model = $event"
  >
    <RatingItem
      v-for="item in items"
      :key="item"
      v-slot="{ steps }"
      :item="item"
      :class="ratingItem()"
    >
      <RatingItemIndicator
        v-for="step in steps"
        :key="step"
        :step="step"
        :aria-label="t.rating.star(step)"
        :class="ratingStep()"
      >
        <Star :class="ratingStar()" />
      </RatingItemIndicator>
    </RatingItem>
  </RatingRoot>
</template>
