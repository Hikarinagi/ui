<script setup lang="ts" generic="T extends SelectOption = SelectOption">
  import { RadioGroupItem, RadioGroupRoot } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useFieldControl } from '../form-field/context'
  import {
    checkbox,
    checkboxControl,
    checkboxBox,
    checkboxDescription,
    checkboxTitle,
    checkboxTitleText,
    type CheckboxVariants,
  } from '../checkbox/checkbox.variants'
  import {
    checkboxGroup,
    checkboxGroupItem,
    type CheckboxGroupVariants,
  } from '../checkbox-group/checkbox-group.variants'
  import type { SelectOption } from '../select/types'
  import { radioDot } from './radio-group.variants'

  defineOptions({ name: 'HnRadioGroup' })

  const props = defineProps<{
    options: T[]
    orientation?: CheckboxGroupVariants['orientation']
    size?: CheckboxVariants['size']
    controlPlacement?: CheckboxVariants['controlPlacement']
    block?: boolean
    disabled?: boolean
    invalid?: boolean
    class?: string
  }>()

  const model = defineModel<string | number | null>()

  const { labelledBy, invalid, disabled, describedBy } = useFieldControl({
    invalid: () => props.invalid,
    disabled: () => props.disabled,
  })

  defineSlots<{ option?(props: { option: T }): unknown }>()
</script>

<template>
  <RadioGroupRoot
    v-model="model"
    :disabled="disabled"
    :aria-labelledby="labelledBy"
    :aria-describedby="describedBy"
    :aria-invalid="invalid || undefined"
    data-hn-radio-group
    :class="cn(checkboxGroup({ orientation: props.orientation, block: props.block }), props.class)"
  >
    <label
      v-for="option in props.options"
      :key="option.value"
      data-hn-radio
      data-hn-state-group
      :data-disabled="disabled || option.disabled ? '' : undefined"
      :class="
        cn(
          checkbox({
            size: props.size,
            controlPlacement: props.controlPlacement,
            block: props.block,
          }),
          checkboxGroupItem({ orientation: props.orientation, block: props.block }),
        )
      "
    >
      <RadioGroupItem
        v-slot="{ checked }"
        :value="option.value"
        :disabled="option.disabled"
        :aria-invalid="invalid || undefined"
        :data-invalid="invalid ? '' : undefined"
        :class="
          cn(
            checkboxBox({ shape: 'round', size: props.size }),
            checkboxControl({ controlPlacement: props.controlPlacement }),
          )
        "
      >
        <Transition
          enter-active-class="hn-transition-press"
          enter-from-class="scale-50 opacity-0"
          leave-active-class="hn-transition"
          leave-to-class="scale-50 opacity-0"
        >
          <span v-if="checked" :class="radioDot()" />
        </Transition>
      </RadioGroupItem>
      <span :class="checkboxTitle({ controlPlacement: props.controlPlacement })">
        <span :class="checkboxTitleText()">
          <slot name="option" :option="option">{{ option.label }}</slot>
        </span>
      </span>
      <span
        v-if="option.description"
        :class="checkboxDescription({ size: props.size, controlPlacement: props.controlPlacement })"
      >
        {{ option.description }}
      </span>
    </label>
  </RadioGroupRoot>
</template>
