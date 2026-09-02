<script setup lang="ts">
  import { Check } from '@lucide/vue'
  import { DropdownMenuCheckboxItem, DropdownMenuItemIndicator } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { dropdownItem } from './dropdown-menu.variants'

  defineOptions({ name: 'HnDropdownMenuCheckboxItem', inheritAttrs: false })

  const props = defineProps<{
    disabled?: boolean
    textValue?: string
    class?: string
  }>()

  const checked = defineModel<boolean>('checked', { default: false })
</script>

<template>
  <DropdownMenuCheckboxItem
    v-bind="$attrs"
    v-model="checked"
    :disabled="props.disabled"
    :text-value="props.textValue"
    :class="cn(dropdownItem(), props.class)"
    @select="(event: Event) => event.preventDefault()"
  >
    <span class="min-w-0 flex-1"><slot /></span>
    <slot name="trailing" />
    <span class="flex size-4 shrink-0 items-center justify-center">
      <DropdownMenuItemIndicator>
        <Check />
      </DropdownMenuItemIndicator>
    </span>
  </DropdownMenuCheckboxItem>
</template>
