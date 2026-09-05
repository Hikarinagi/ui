<script setup lang="ts">
  import { SwitchRoot } from 'reka-ui'
  import { useSlots } from 'vue'
  import { cn } from '../../lib/cn'
  import { useFieldControl } from '../form-field/context'
  import {
    checkbox,
    checkboxDescription,
    checkboxTitle,
    checkboxTitleText,
  } from '../checkbox/checkbox.variants'
  import { switchThumb, switchTrack, type SwitchVariants } from './switch.variants'

  defineOptions({ name: 'HnSwitch', inheritAttrs: false })

  const props = defineProps<{
    size?: SwitchVariants['size']
    description?: string
    disabled?: boolean
    invalid?: boolean
    class?: string
  }>()

  const model = defineModel<boolean>({ default: false })

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
    data-hn-switch
    data-hn-state-group
    :data-disabled="disabled ? '' : undefined"
    :class="cn(checkbox({ size: props.size }), props.class)"
  >
    <SwitchRoot
      v-bind="$attrs"
      v-model="model"
      :id="fieldId"
      :disabled="disabled"
      :aria-invalid="invalid || undefined"
      :aria-describedby="describedBy"
      :data-invalid="invalid ? '' : undefined"
      :data-hn-on="model ? '' : undefined"
      :class="switchTrack({ size: props.size })"
    >
      <span data-hn-thumb aria-hidden="true" :class="switchThumb()" />
    </SwitchRoot>
    <span v-if="slots.default" :class="checkboxTitle()">
      <span :class="checkboxTitleText()"><slot /></span>
    </span>
    <span v-if="props.description" :class="checkboxDescription({ size: props.size })">
      {{ props.description }}
    </span>
  </label>
</template>
