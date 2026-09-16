<script setup lang="ts" generic="T extends StepperItem = StepperItem">
  import { StepperRoot } from 'reka-ui'
  import { useId } from 'vue'
  import { cn } from '../../lib/cn'
  import { useDirection } from '../../lib/useDirection'
  import { useUiLocale } from '../../locale'
  import StepperStep from './StepperStep.vue'
  import { stepper } from './stepper.variants'
  import { useStepper } from './composables/useStepper'
  import type { StepperItem, StepperNavigation, StepperProps, StepperSlotProps } from './types'

  defineOptions({ name: 'HnStepper' })
  const props = withDefaults(defineProps<StepperProps<T>>(), {
    defaultValue: 1,
    orientation: 'horizontal',
    linear: true,
  })
  const emit = defineEmits<{ 'update:modelValue': [step: number]; error: [error: unknown] }>()
  const slots = defineSlots<{
    default?(props: StepperNavigation<T>): unknown
    indicator?(props: StepperSlotProps<T>): unknown
    title?(props: StepperSlotProps<T>): unknown
    description?(props: StepperSlotProps<T>): unknown
  }>()
  const t = useUiLocale()
  const id = useId()
  const { root, direction, rootDirection } = useDirection(() => props.dir)
  const { step, pending, entries, navigation, next, prev, goTo, canNext, canPrev } = useStepper(
    props,
    value => emit('update:modelValue', value),
    error => emit('error', error),
  )

  defineExpose({ step, pending, next, prev, goTo, canNext, canPrev })
</script>

<template>
  <div
    ref="root"
    data-hn-stepper
    :dir="rootDirection"
    :class="cn(stepper({ size: props.size }), props.class)"
    :aria-busy="pending || undefined"
  >
    <StepperRoot
      :model-value="step"
      :orientation="props.orientation"
      :dir="direction"
      :linear="props.linear"
      :aria-label="props.label ?? t.stepper.label"
      class="min-w-0 [&>[role=status]]:hidden"
      @update:model-value="value => value !== undefined && goTo(value)"
    >
      <ol
        role="list"
        class="hn-stepper-list m-0 grid min-w-0 list-none p-0"
        :data-orientation="props.orientation"
      >
        <StepperStep
          v-for="entry in entries"
          :id="`${id}-${entry.step}`"
          :key="entry.step"
          :entry="entry"
          :orientation="props.orientation"
          :pending="pending"
          :last="entry.step === entries.length"
          :panel-id="slots.default ? `${id}-panel` : undefined"
          @select="goTo"
        >
          <template v-if="slots.indicator" #indicator="scope">
            <slot name="indicator" v-bind="scope" />
          </template>
          <template v-if="slots.title" #title="scope">
            <slot name="title" v-bind="scope" />
          </template>
          <template v-if="slots.description" #description="scope">
            <slot name="description" v-bind="scope" />
          </template>
        </StepperStep>
      </ol>
    </StepperRoot>
    <div
      v-if="slots.default"
      :id="`${id}-panel`"
      :role="step ? 'region' : undefined"
      :aria-labelledby="step ? `${id}-${step}-title` : undefined"
      class="min-w-0"
    >
      <slot v-bind="navigation" />
    </div>
    <span v-if="entries.length" class="sr-only" role="status" aria-live="polite" aria-atomic="true">
      {{ t.stepper.progress(step, entries.length) }}
    </span>
  </div>
</template>
