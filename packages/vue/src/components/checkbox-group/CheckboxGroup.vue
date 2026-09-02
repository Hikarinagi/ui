<script setup lang="ts">
  import { CheckboxGroupRoot } from 'reka-ui'
  import { cn } from '../../lib/cn'
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

  defineSlots<{ option(props: { option: SelectOption }): unknown }>()
</script>

<template>
  <CheckboxGroupRoot
    v-model="model"
    :disabled="props.disabled"
    :roving-focus="false"
    role="group"
    data-hn-checkbox-group
    :data-orientation="props.orientation ?? 'vertical'"
    :data-disabled="props.disabled ? '' : undefined"
    :class="cn(checkboxGroup({ orientation: props.orientation }), props.class)"
  >
    <Checkbox
      v-for="option in props.options"
      :key="option.value"
      :value="option.value"
      :size="props.size"
      :disabled="props.disabled || option.disabled"
      :invalid="props.invalid"
      :description="option.description"
    >
      <slot name="option" :option="option">{{ option.label }}</slot>
    </Checkbox>
  </CheckboxGroupRoot>
</template>
