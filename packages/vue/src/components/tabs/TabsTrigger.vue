<script setup lang="ts">
  import { TabsTrigger } from 'reka-ui'
  import Ripple from '../ripple/Ripple.vue'
  import { cn } from '../../lib/cn'
  import { useTabsStyle } from './context'
  import { tabsTrigger } from './tabs.variants'

  defineOptions({ name: 'HnTabsTrigger' })

  const props = defineProps<{
    value: string
    disabled?: boolean
    class?: string
  }>()

  const { variant, size, orientation } = useTabsStyle()
</script>

<template>
  <TabsTrigger
    :value="props.value"
    :disabled="props.disabled"
    :class="cn(tabsTrigger({ variant, size, orientation }), props.class)"
  >
    <Ripple />
    <slot />
  </TabsTrigger>
</template>
