<script setup lang="ts">
  import { computed } from 'vue'
  import { ChevronDown, ChevronUp } from '@lucide/vue'
  import {
    NumberFieldDecrement,
    NumberFieldIncrement,
    NumberFieldInput,
    NumberFieldRoot,
    useForwardPropsEmits,
    type NumberFieldRootEmits,
  } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import { useFieldControl } from '../form-field/context'
  import { injectInputGroup } from '../input-group/context'
  import {
    inputControl,
    inputEmbedded,
    inputHost,
    type InputVariants,
  } from '../input/input.variants'
  import { numberInputStep, numberInputStepper } from './number-input.variants'

  defineOptions({ name: 'HnNumberInput', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      modelValue?: number | null
      defaultValue?: number
      min?: number
      max?: number
      step?: number
      stepSnapping?: boolean
      formatOptions?: Intl.NumberFormatOptions
      locale?: string
      controls?: boolean
      variant?: InputVariants['variant']
      size?: InputVariants['size']
      disabled?: boolean
      readonly?: boolean
      invalid?: boolean
      class?: string
    }>(),
    { step: 1, stepSnapping: true, controls: true },
  )
  const emits = defineEmits<NumberFieldRootEmits>()

  const t = useUiLocale()
  const group = injectInputGroup()
  const size = computed(() => (group ? group.size.value : props.size))
  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl({
    invalid: () => props.invalid || !!group?.invalid.value,
    disabled: () => props.disabled || !!group?.disabled.value,
  })

  const forwarded = useForwardPropsEmits(
    () => ({
      modelValue: props.modelValue,
      defaultValue: props.defaultValue,
      min: props.min,
      max: props.max,
      step: props.step,
      stepSnapping: props.stepSnapping,
      formatOptions: props.formatOptions,
      readonly: props.readonly,
    }),
    emits,
  )
</script>

<template>
  <NumberFieldRoot
    v-bind="forwarded"
    :locale="props.locale ?? t.tag"
    :disabled="disabled"
    data-hn-number-input
    :data-invalid="invalid ? '' : undefined"
    :data-disabled="disabled ? '' : undefined"
    :class="
      cn(
        group ? inputEmbedded() : inputHost({ variant: props.variant, size: props.size }),
        props.class,
      )
    "
  >
    <NumberFieldInput
      v-bind="$attrs"
      :id="fieldId"
      :aria-invalid="invalid || undefined"
      :aria-describedby="describedBy"
      :class="cn(inputControl(), 'tabular-nums')"
    />
    <div v-if="props.controls" :class="numberInputStepper({ size })">
      <NumberFieldIncrement :aria-label="t.numberInput.increase" :class="numberInputStep()">
        <ChevronUp />
      </NumberFieldIncrement>
      <NumberFieldDecrement
        :aria-label="t.numberInput.decrease"
        :class="numberInputStep({ divided: true })"
      >
        <ChevronDown />
      </NumberFieldDecrement>
    </div>
  </NumberFieldRoot>
</template>
