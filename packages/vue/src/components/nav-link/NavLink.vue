<script setup lang="ts">
  import { Primitive, type PrimitiveProps } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnNavLink' })

  const props = withDefaults(
    defineProps<
      PrimitiveProps & {
        active?: boolean
        disabled?: boolean
        class?: string
      }
    >(),
    { as: 'a', active: false, disabled: false },
  )
</script>

<template>
  <Primitive
    :as="props.as"
    :as-child="props.asChild"
    :aria-current="props.active ? 'page' : undefined"
    :data-state="props.active ? 'selected' : undefined"
    :aria-disabled="props.disabled ? 'true' : undefined"
    :data-disabled="props.disabled ? '' : undefined"
    :tabindex="props.disabled ? -1 : undefined"
    :class="
      cn(
        'hn-interactive hn-state-layer hn-press-none relative isolate flex cursor-pointer items-center',
        'gap-[var(--hn-control-gap)] rounded-md px-2 py-1.5 text-sm select-none',
        props.active ? 'text-fg font-medium' : 'text-muted',
        props.class,
      )
    "
  >
    <slot name="icon" />
    <slot />
  </Primitive>
</template>
