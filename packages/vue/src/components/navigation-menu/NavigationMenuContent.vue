<script setup lang="ts">
  import {
    NavigationMenuContent as RekaNavigationMenuContent,
    useForwardPropsEmits,
    type NavigationMenuContentEmits,
  } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { navigationMenuContent } from './navigation-menu.variants'

  defineOptions({ name: 'HnNavigationMenuContent', inheritAttrs: false })
  const props = withDefaults(defineProps<{ padded?: boolean; class?: string }>(), { padded: true })
  const emit = defineEmits<NavigationMenuContentEmits>()
  const events = useForwardPropsEmits({}, emit)
  defineSlots<{ default(): unknown }>()
</script>

<template>
  <RekaNavigationMenuContent
    v-bind="{ ...$attrs, ...events }"
    data-hn-navigation-content
    :class="cn(navigationMenuContent({ padded: props.padded }), props.class)"
  >
    <slot />
  </RekaNavigationMenuContent>
</template>
