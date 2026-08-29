<script setup lang="ts">
  import { ChevronRight } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import Button from '../button/Button.vue'
  import Collapsible from '../collapsible/Collapsible.vue'
  import CollapsibleTrigger from '../collapsible/CollapsibleTrigger.vue'
  import CollapsibleContent from '../collapsible/CollapsibleContent.vue'

  defineOptions({ name: 'HnSidebarGroup' })

  const props = withDefaults(
    defineProps<{
      label: string
      defaultOpen?: boolean
      class?: string
    }>(),
    { defaultOpen: true },
  )
</script>

<template>
  <Collapsible :default-open="props.defaultOpen" :class="cn(props.class)">
    <CollapsibleTrigger as-child>
      <Button
        variant="ghost"
        tone="neutral"
        size="sm"
        block
        class="group/sidebar-group text-muted justify-between font-medium"
      >
        {{ props.label }}
        <template #trailing>
          <ChevronRight class="hn-transition group-data-[state=open]/sidebar-group:rotate-90" />
        </template>
      </Button>
    </CollapsibleTrigger>
    <CollapsibleContent>
      <div class="flex flex-col gap-0.5 pt-1 ps-2">
        <slot />
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>
