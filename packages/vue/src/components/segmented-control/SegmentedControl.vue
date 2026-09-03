<script setup lang="ts">
  import { ToggleGroupItem, ToggleGroupRoot, type AcceptableValue } from 'reka-ui'
  import { computed, useId, useSlots } from 'vue'
  import { cn } from '../../lib/cn'
  import Highlight from '../highlight/Highlight.vue'
  import Ripple from '../ripple/Ripple.vue'
  import type { SelectOption } from '../select/types'
  import {
    segmentedControl,
    segmentedItem,
    segmentedThumb,
    type SegmentedControlVariants,
    type SegmentedItemVariants,
  } from './segmented-control.variants'

  defineOptions({ name: 'HnSegmentedControl' })

  const props = withDefaults(
    defineProps<{
      options: SelectOption[]
      size?: SegmentedItemVariants['size']
      orientation?: SegmentedControlVariants['orientation']
      block?: boolean
      disabled?: boolean
      class?: string
    }>(),
    { orientation: 'horizontal', block: false },
  )

  const model = defineModel<string | number>()

  defineSlots<{ option(props: { option: SelectOption }): unknown }>()

  const slots = useSlots()
  const highlightId = useId()

  const current = computed(
    () => model.value ?? props.options.find(option => !option.disabled)?.value,
  )

  function select(value: AcceptableValue | AcceptableValue[] | undefined) {
    if (typeof value === 'string' || typeof value === 'number') model.value = value
  }
</script>

<template>
  <ToggleGroupRoot
    type="single"
    :model-value="current"
    :disabled="props.disabled"
    :orientation="props.orientation"
    data-hn-segmented-control
    :data-disabled="props.disabled ? '' : undefined"
    :class="
      cn(segmentedControl({ orientation: props.orientation, block: props.block }), props.class)
    "
    @update:model-value="select"
  >
    <ToggleGroupItem
      v-for="option in props.options"
      :key="option.value"
      :value="option.value"
      :disabled="option.disabled"
      :aria-label="slots.option ? option.label : undefined"
      :class="segmentedItem({ size: props.size, block: props.block })"
    >
      <Highlight v-if="option.value === current" :id="highlightId" :class="segmentedThumb()" />
      <Ripple />
      <slot name="option" :option="option">{{ option.label }}</slot>
    </ToggleGroupItem>
  </ToggleGroupRoot>
</template>
