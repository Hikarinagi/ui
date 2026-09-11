<script setup lang="ts" generic="T extends SelectOption = SelectOption">
  import { Check } from '@lucide/vue'
  import { injectListboxItemContext, ListboxItemIndicator } from 'reka-ui'
  import type { SelectOption } from '../select/types'

  defineOptions({ name: 'HnListboxOptionContent', inheritAttrs: false })
  const props = defineProps<{ option: T }>()
  const slots = defineSlots<{
    option?(props: { option: T; selected: boolean }): unknown
    trailing?(props: { option: T; selected: boolean }): unknown
  }>()
  const { isSelected: selected } = injectListboxItemContext()
</script>

<template>
  <span class="min-w-0 flex-1">
    <slot name="option" :option="props.option" :selected="selected">
      <span class="block truncate">{{ props.option.label }}</span>
      <span v-if="props.option.description" class="text-muted block truncate text-xs">
        {{ props.option.description }}
      </span>
    </slot>
  </span>
  <slot v-if="slots.trailing" name="trailing" :option="props.option" :selected="selected" />
  <span v-else class="flex size-4 shrink-0 items-center justify-center">
    <ListboxItemIndicator><Check /></ListboxItemIndicator>
  </span>
</template>
