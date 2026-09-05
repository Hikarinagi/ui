<script setup lang="ts">
  import { ChevronRight } from '@lucide/vue'
  import { MenubarPortal, MenubarSub, MenubarSubContent, MenubarSubTrigger } from 'reka-ui'
  import Card from '../card/Card.vue'
  import { cn } from '../../lib/cn'
  import { dropdownItem } from '../dropdown-menu/dropdown-menu.variants'
  import { menubarContent } from './menubar.variants'

  defineOptions({ name: 'HnMenubarSub' })

  const props = defineProps<{
    label?: string
    disabled?: boolean
    textValue?: string
    class?: string
  }>()

  const open = defineModel<boolean>('open')
</script>

<template>
  <MenubarSub v-model:open="open">
    <MenubarSubTrigger
      :disabled="props.disabled"
      :text-value="props.textValue ?? props.label"
      :class="dropdownItem()"
    >
      <slot name="icon" />
      <span class="min-w-0 flex-1">
        <slot name="label">{{ props.label }}</slot>
      </span>
      <ChevronRight class="text-muted" />
    </MenubarSubTrigger>
    <MenubarPortal>
      <MenubarSubContent as-child :side-offset="4">
        <Card :padded="false" :class="cn(menubarContent(), props.class)">
          <slot />
        </Card>
      </MenubarSubContent>
    </MenubarPortal>
  </MenubarSub>
</template>
