<script setup lang="ts">
  import { Primitive, type PrimitiveProps } from 'reka-ui'
  import { cn } from '../../lib/cn'

  defineOptions({ name: 'HnBreadcrumbItem', inheritAttrs: false })

  const props = withDefaults(
    defineProps<
      PrimitiveProps & {
        current?: boolean
        class?: string
      }
    >(),
    { as: 'a', current: false },
  )
</script>

<template>
  <li class="flex items-center">
    <span
      v-if="props.current"
      v-bind="$attrs"
      aria-current="page"
      :class="cn('text-fg font-medium', props.class)"
    >
      <slot />
    </span>
    <Primitive
      v-else
      v-bind="$attrs"
      :as="props.as"
      :as-child="props.asChild"
      :class="cn('hn-link [--hn-link-color:var(--hn-fg-muted)]', props.class)"
    >
      <slot />
    </Primitive>
  </li>
</template>
