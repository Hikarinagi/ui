<script setup lang="ts">
  import { Inbox } from '@lucide/vue'
  import { useSlots } from 'vue'
  import { cn } from '../../lib/cn'
  import {
    empty,
    emptyActions,
    emptyDescription,
    emptyIcon,
    emptyText,
    emptyTitle,
    type EmptyVariants,
  } from './empty.variants'

  defineOptions({ name: 'HnEmpty' })

  const props = withDefaults(
    defineProps<{
      title?: string
      description?: string
      icon?: boolean
      size?: EmptyVariants['size']
      class?: string
    }>(),
    { icon: true, size: 'md' },
  )

  const slots = useSlots()
</script>

<template>
  <div data-hn-empty :class="cn(empty({ size: props.size }), props.class)">
    <span v-if="slots.icon" aria-hidden="true" class="flex shrink-0 justify-center">
      <slot name="icon" />
    </span>
    <span v-else-if="props.icon" aria-hidden="true" :class="emptyIcon({ size: props.size })">
      <Inbox />
    </span>
    <div v-if="props.title || props.description" :class="emptyText()">
      <p v-if="props.title" :class="emptyTitle({ size: props.size })">{{ props.title }}</p>
      <p v-if="props.description" :class="emptyDescription({ size: props.size })">
        {{ props.description }}
      </p>
    </div>
    <slot />
    <div v-if="slots.actions" :class="emptyActions()">
      <slot name="actions" />
    </div>
  </div>
</template>
