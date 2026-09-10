<script setup lang="ts">
  import { SwitchRoot } from 'reka-ui'
  import { useSlots } from 'vue'
  import { cn } from '../../lib/cn'
  import { useFieldControl } from '../form-field/context'
  import {
    checkbox,
    checkboxControl,
    checkboxDescription,
    checkboxTitle,
    checkboxTitleText,
    type CheckboxVariants,
  } from '../checkbox/checkbox.variants'
  import { switchThumb, switchTrack, type SwitchVariants } from './switch.variants'

  defineOptions({ name: 'HnSwitch', inheritAttrs: false })

  const props = defineProps<{
    size?: SwitchVariants['size']
    description?: string
    controlPlacement?: CheckboxVariants['controlPlacement']
    block?: boolean
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
    :class="
      cn(
        checkbox({
          size: props.size,
          controlPlacement: props.controlPlacement,
          block: props.block,
          bare: !slots.default && !props.description,
        }),
        props.class,
      )
    "
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
      :class="
        cn(
          switchTrack({ size: props.size }),
          checkboxControl({ controlPlacement: props.controlPlacement }),
        )
      "
    >
      <span data-hn-thumb aria-hidden="true" :class="switchThumb()" />
    </SwitchRoot>
    <span v-if="slots.default" :class="checkboxTitle({ controlPlacement: props.controlPlacement })">
      <span :class="checkboxTitleText()"><slot /></span>
    </span>
    <span
      v-if="props.description"
      :class="checkboxDescription({ size: props.size, controlPlacement: props.controlPlacement })"
    >
      {{ props.description }}
    </span>
  </label>
</template>
