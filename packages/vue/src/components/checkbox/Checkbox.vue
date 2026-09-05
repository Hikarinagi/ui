<script setup lang="ts">
  import { Check, Minus } from '@lucide/vue'
  import { CheckboxRoot } from 'reka-ui'
  import { useSlots } from 'vue'
  import { cn } from '../../lib/cn'
  import { useFieldControl } from '../form-field/context'
  import {
    checkbox,
    checkboxBox,
    checkboxDescription,
    checkboxTitle,
    checkboxTitleText,
    type CheckboxVariants,
  } from './checkbox.variants'

  defineOptions({ name: 'HnCheckbox', inheritAttrs: false })

  const props = defineProps<{
    size?: CheckboxVariants['size']
    description?: string
    disabled?: boolean
    invalid?: boolean
    class?: string
  }>()

  const model = defineModel<boolean | 'indeterminate'>({ default: false })

  const slots = useSlots()

  const {
    id: fieldId,
    invalid,
    disabled,
    describedBy,
  } = useFieldControl({
    invalid: () => props.invalid,
    disabled: () => props.disabled,
  })
</script>

<template>
  <label
    data-hn-checkbox
    data-hn-state-group
    :data-disabled="disabled ? '' : undefined"
    :class="cn(checkbox({ size: props.size }), props.class)"
  >
    <CheckboxRoot
      v-slot="{ state }"
      v-bind="$attrs"
      v-model="model"
      :id="fieldId"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      :aria-describedby="describedBy"
      :data-invalid="invalid ? '' : undefined"
      :class="checkboxBox({ size: props.size })"
    >
      <Transition
        enter-active-class="hn-transition-press"
        enter-from-class="scale-50 opacity-0"
        leave-active-class="hn-transition"
        leave-to-class="scale-50 opacity-0"
      >
        <Check v-if="state === true" aria-hidden="true" />
      </Transition>
      <Transition
        enter-active-class="hn-transition-press"
        enter-from-class="scale-50 opacity-0"
        leave-active-class="hn-transition"
        leave-to-class="scale-50 opacity-0"
      >
        <Minus v-if="state === 'indeterminate'" aria-hidden="true" />
      </Transition>
    </CheckboxRoot>
    <span v-if="slots.default" :class="checkboxTitle()">
      <span :class="checkboxTitleText()"><slot /></span>
    </span>
    <span v-if="props.description" :class="checkboxDescription({ size: props.size })">
      {{ props.description }}
    </span>
  </label>
</template>
