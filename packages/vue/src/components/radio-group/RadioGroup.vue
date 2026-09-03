<script setup lang="ts">
  import { RadioGroupItem, RadioGroupRoot } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import {
    checkbox,
    checkboxBox,
    checkboxDescription,
    checkboxTitle,
    checkboxTitleText,
    type CheckboxVariants,
  } from '../checkbox/checkbox.variants'
  import {
    checkboxGroup,
    type CheckboxGroupVariants,
  } from '../checkbox-group/checkbox-group.variants'
  import type { SelectOption } from '../select/types'
  import { radioDot } from './radio-group.variants'

  defineOptions({ name: 'HnRadioGroup' })

  const props = defineProps<{
    options: SelectOption[]
    orientation?: CheckboxGroupVariants['orientation']
    size?: CheckboxVariants['size']
    disabled?: boolean
    invalid?: boolean
    class?: string
  }>()

  const model = defineModel<string | number | null>()

  defineSlots<{ option(props: { option: SelectOption }): unknown }>()
</script>

<template>
  <RadioGroupRoot
    v-model="model"
    :disabled="props.disabled"
    data-hn-radio-group
    :class="cn(checkboxGroup({ orientation: props.orientation }), props.class)"
  >
    <label
      v-for="option in props.options"
      :key="option.value"
      data-hn-radio
      data-hn-state-group
      :data-disabled="props.disabled || option.disabled ? '' : undefined"
      :class="checkbox({ size: props.size })"
    >
      <RadioGroupItem
        v-slot="{ checked }"
        :value="option.value"
        :disabled="option.disabled"
        :aria-invalid="props.invalid || undefined"
        :data-invalid="props.invalid ? '' : undefined"
        :class="checkboxBox({ shape: 'round', size: props.size })"
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
      <span :class="checkboxTitle()">
        <span :class="checkboxTitleText()">
          <slot name="option" :option="option">{{ option.label }}</slot>
        </span>
      </span>
      <span v-if="option.description" :class="checkboxDescription({ size: props.size })">
        {{ option.description }}
      </span>
    </label>
  </RadioGroupRoot>
</template>
