<script setup lang="ts">
  import { RatingItem, RatingItemIndicator, RatingRoot } from 'reka-ui'
  import { Star } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import { useFieldControl } from '../form-field/context'
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
  import { useRatingScale } from './composables/useRatingScale'

  defineOptions({ name: 'HnRating', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      max?: number
      stars?: number
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
  const { count, scaled, value, toScore } = useRatingScale(
    model,
    () => props.max,
    () => props.stars,
  )

  const t = useUiLocale()

  const { labelledBy, invalid, disabled, describedBy } = useFieldControl({
    disabled: () => props.disabled,
  })
</script>

<template>
  <span
    v-if="props.readonly"
    v-bind="$attrs"
    data-hn-rating
    data-readonly
    role="img"
    :aria-label="scaled ? t.rating.score(model, props.max) : t.rating.label(model, props.max)"
    :class="cn(ratingRoot({ size: props.size }), props.class)"
  >
    <span v-for="index in count" :key="index" :class="ratingItem()">
      <Star :class="ratingStar()" />
      <span :class="ratingFill()" :style="{ width: starFill(value, index) }">
        <Star :class="ratingStar({ active: true })" />
      </span>
    </span>
  </span>
  <RatingRoot
    v-else
    v-slot="{ items }"
    v-bind="$attrs"
    data-hn-rating
    :data-disabled="disabled ? '' : undefined"
    :data-invalid="invalid ? '' : undefined"
    :aria-labelledby="labelledBy"
    :aria-describedby="describedBy"
    :aria-invalid="invalid || undefined"
    v-model="value"
    :length="count"
    :step="props.step"
    :clearable="props.clearable"
    hoverable
    :disabled="disabled"
    :name="scaled ? undefined : props.name"
    :class="cn(ratingRoot({ size: props.size }), props.class)"
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
        :aria-label="scaled ? t.rating.score(toScore(step), props.max) : t.rating.star(step)"
        :class="ratingStep()"
      >
        <Star :class="ratingStar()" />
      </RatingItemIndicator>
    </RatingItem>
    <input
      v-if="scaled && props.name"
      type="hidden"
      :name="props.name"
      :value="model"
      :disabled="disabled"
      :form="$attrs.form as string | undefined"
    />
  </RatingRoot>
</template>
