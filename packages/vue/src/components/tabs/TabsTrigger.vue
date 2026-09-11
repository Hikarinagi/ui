<script setup lang="ts">
  import { TabsTrigger, injectTabsRootContext } from 'reka-ui'
  import { computed } from 'vue'
  import Highlight from '../highlight/Highlight.vue'
  import Ripple from '../ripple/Ripple.vue'
  import { cn } from '../../lib/cn'
  import { useTabsStyle } from './context'
  import { tabsHighlight, tabsTrigger } from './tabs.variants'

  defineOptions({ name: 'HnTabsTrigger' })

  const props = defineProps<{
    value: string
    disabled?: boolean
    class?: string
  }>()

  const { variant, size, orientation, highlightId } = useTabsStyle()
  const root = injectTabsRootContext()
  const active = computed(() => root.modelValue.value === props.value)
</script>

<template>
  <TabsTrigger
    :value="props.value"
    :disabled="props.disabled"
    :class="cn(tabsTrigger({ variant, size, orientation }), props.class)"
  >
    <Highlight
      v-if="active"
      :id="highlightId"
      :axis="orientation === 'vertical' ? 'y' : 'x'"
      :class="tabsHighlight({ variant, orientation })"
    />
    <Ripple />
    <slot />
  </TabsTrigger>
</template>
