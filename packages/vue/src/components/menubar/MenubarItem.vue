<script setup lang="ts">
  import { MenubarItem } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { dropdownItem, type DropdownItemVariants } from '../dropdown-menu/dropdown-menu.variants'

  defineOptions({ name: 'HnMenubarItem', inheritAttrs: false })

  const props = defineProps<{
    tone?: DropdownItemVariants['tone']
    disabled?: boolean
    textValue?: string
    class?: string
  }>()

  const emit = defineEmits<{ select: [event: Event] }>()
</script>

<template>
  <MenubarItem
    v-bind="$attrs"
    :disabled="props.disabled"
    :text-value="props.textValue"
    :class="cn(dropdownItem({ tone: props.tone }), props.class)"
    @select="emit('select', $event)"
  >
    <slot name="icon" />
    <span class="min-w-0 flex-1"><slot /></span>
    <slot name="trailing" />
  </MenubarItem>
</template>
