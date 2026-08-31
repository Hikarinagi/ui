<script setup lang="ts">
  import { ChevronRight } from '@lucide/vue'
  import {
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent,
  } from 'reka-ui'
  import Card from '../card/Card.vue'
  import { cn } from '../../lib/cn'
  import { dropdownItem } from './dropdown-menu.variants'

  defineOptions({ name: 'HnDropdownMenuSub' })

  const props = defineProps<{
    label?: string
    disabled?: boolean
    textValue?: string
    class?: string
  }>()

  const open = defineModel<boolean>('open')
</script>

<template>
  <DropdownMenuSub v-model:open="open">
    <DropdownMenuSubTrigger
      :disabled="props.disabled"
      :text-value="props.textValue ?? props.label"
      :class="dropdownItem()"
    >
      <slot name="icon" />
      <span class="min-w-0 flex-1">
        <slot name="label">{{ props.label }}</slot>
      </span>
      <ChevronRight class="text-muted" />
    </DropdownMenuSubTrigger>
    <DropdownMenuPortal>
      <DropdownMenuSubContent as-child :side-offset="4">
        <Card
          :padded="false"
          :class="
            cn(
              'hn-anim-pop z-(--hn-z-overlay) flex min-w-40 flex-col gap-0.5 p-1 shadow-md outline-none',
              props.class,
            )
          "
        >
          <slot />
        </Card>
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  </DropdownMenuSub>
</template>
