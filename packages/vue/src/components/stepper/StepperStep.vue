<script setup lang="ts" generic="T extends StepperItem = StepperItem">
  import { CircleAlert, Check } from '@lucide/vue'
  import {
    StepperItem as RekaStepperItem,
    StepperTrigger,
    StepperTitle,
    StepperDescription,
    StepperIndicator,
    StepperSeparator,
  } from 'reka-ui'
  import { useUiLocale } from '../../locale'
  import Spinner from '../spinner/Spinner.vue'
  import { stepperIndicator, stepperTrigger } from './stepper.variants'
  import type { StepperItem, StepperSlotProps, StepperOrientation } from './types'

  const props = defineProps<{
    entry: StepperSlotProps<T>
    id: string
    panelId?: string
    pending: boolean
    last: boolean
    orientation: StepperOrientation
  }>()
  const emit = defineEmits<{ select: [step: number] }>()
  const slots = defineSlots<{
    indicator?(props: StepperSlotProps<T>): unknown
    title?(props: StepperSlotProps<T>): unknown
    description?(props: StepperSlotProps<T>): unknown
  }>()
  const t = useUiLocale()
</script>

<template>
  <RekaStepperItem
    as="li"
    :step="entry.step"
    :disabled="entry.disabled"
    :completed="entry.state === 'completed'"
    :aria-current="undefined"
    :data-hn-state="entry.state"
    class="hn-stepper-item min-w-0"
  >
    <StepperTrigger
      :id="`${id}-trigger`"
      :aria-labelledby="`${id}-title`"
      :aria-describedby="
        [
          entry.item.description || slots.description ? `${id}-description` : undefined,
          entry.state === 'error' || entry.state === 'completed' ? `${id}-status` : undefined,
        ]
          .filter(Boolean)
          .join(' ') || undefined
      "
      :aria-controls="panelId"
      :aria-current="entry.active ? 'step' : undefined"
      :aria-disabled="props.pending || undefined"
      :data-disabled="entry.disabled || props.pending ? '' : undefined"
      :class="stepperTrigger({ orientation: props.orientation })"
      @mousedown.capture.stop
      @click="emit('select', entry.step)"
    >
      <StepperIndicator :class="stepperIndicator({ state: entry.state })" aria-hidden="true">
        <slot name="indicator" v-bind="entry">
          <Spinner v-if="props.pending && entry.active" size="sm" />
          <CircleAlert v-else-if="entry.state === 'error'" />
          <Check v-else-if="entry.state === 'completed'" />
          <template v-else>{{ entry.step }}</template>
        </slot>
      </StepperIndicator>
      <span class="flex min-w-0 flex-1 flex-col justify-center gap-1 self-stretch wrap-anywhere">
        <StepperTitle
          as="span"
          :id="`${id}-title`"
          class="font-medium"
          :class="entry.state === 'error' ? 'text-danger-text' : undefined"
        >
          <slot name="title" v-bind="entry">{{ entry.item.title }}</slot>
        </StepperTitle>
        <StepperDescription
          v-if="entry.item.description || slots.description"
          as="span"
          :id="`${id}-description`"
          class="text-muted text-xs"
        >
          <slot name="description" v-bind="entry">{{ entry.item.description }}</slot>
        </StepperDescription>
        <span
          v-if="entry.state === 'error' || entry.state === 'completed'"
          :id="`${id}-status`"
          class="sr-only"
        >
          {{ entry.state === 'error' ? t.stepper.error : t.stepper.completed }}
        </span>
      </span>
    </StepperTrigger>
    <StepperSeparator
      v-if="!props.last"
      class="hn-stepper-separator hn-transition-base"
      :class="entry.state === 'completed' ? 'bg-accent' : 'bg-line'"
    />
  </RekaStepperItem>
</template>
