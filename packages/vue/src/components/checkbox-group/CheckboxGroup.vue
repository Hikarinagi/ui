<script setup lang="ts">
  import { CheckboxGroupRoot } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { shieldFormField, useFieldControl } from '../form-field/context'
  import Checkbox from '../checkbox/Checkbox.vue'
  import type { CheckboxVariants } from '../checkbox/checkbox.variants'
  import type { SelectOption } from '../select/types'
  import { checkboxGroup, type CheckboxGroupVariants } from './checkbox-group.variants'

  defineOptions({ name: 'HnCheckboxGroup' })

  const props = defineProps<{
    options: SelectOption[]
    orientation?: CheckboxGroupVariants['orientation']
    size?: CheckboxVariants['size']
    disabled?: boolean
    invalid?: boolean
    class?: string
  }>()

  const model = defineModel<Array<string | number>>({ default: () => [] })

  const { labelledBy, invalid, disabled, describedBy } = useFieldControl({
    invalid: () => props.invalid,
    disabled: () => props.disabled,
  })
  shieldFormField()

  defineSlots<{ option(props: { option: SelectOption }): unknown }>()
</script>

<template>
  <CheckboxGroupRoot
    v-model="model"
    :disabled="disabled"
    :roving-focus="false"
    role="group"
    :aria-labelledby="labelledBy"
    :aria-describedby="describedBy"
    :aria-invalid="invalid || undefined"
    data-hn-checkbox-group
    :data-orientation="props.orientation ?? 'vertical'"
    :data-disabled="disabled ? '' : undefined"
    :class="cn(checkboxGroup({ orientation: props.orientation }), props.class)"
  >
    <Checkbox
      v-for="option in props.options"
      :key="option.value"
      :value="option.value"
      :size="props.size"
      :disabled="disabled || option.disabled"
      :invalid="invalid"
      :description="option.description"
    >
      <slot name="option" :option="option">{{ option.label }}</slot>
    </Checkbox>
  </CheckboxGroupRoot>
</template>
