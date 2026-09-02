<script setup lang="ts">
  import { Check } from '@lucide/vue'
  import { DropdownMenuRadioItem, DropdownMenuItemIndicator } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { dropdownItem } from './dropdown-menu.variants'

  defineOptions({ name: 'HnDropdownMenuRadioItem', inheritAttrs: false })

  const props = defineProps<{
    value: string
    disabled?: boolean
    textValue?: string
    class?: string
  }>()
</script>

<template>
  <DropdownMenuRadioItem
    v-bind="$attrs"
    :value="props.value"
    :disabled="props.disabled"
    :text-value="props.textValue"
    :class="cn(dropdownItem(), props.class)"
  >
    <span class="min-w-0 flex-1"><slot /></span>
    <span class="flex size-4 shrink-0 items-center justify-center">
      <DropdownMenuItemIndicator>
        <Check class="size-4" />
      </DropdownMenuItemIndicator>
    </span>
  </DropdownMenuRadioItem>
</template>
