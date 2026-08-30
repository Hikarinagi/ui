<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { ChevronRight } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import Button from '../button/Button.vue'
  import Collapsible from '../collapsible/Collapsible.vue'
  import CollapsibleTrigger from '../collapsible/CollapsibleTrigger.vue'
  import CollapsibleContent from '../collapsible/CollapsibleContent.vue'
  import { useSidebar } from './context'

  defineOptions({ name: 'HnSidebarGroup' })

  const props = withDefaults(
    defineProps<{
      label: string
      defaultOpen?: boolean
      class?: string
    }>(),
    { defaultOpen: true },
  )

  const sidebar = useSidebar()
  const rail = computed(() => sidebar?.state.value === 'rail')

  const open = ref(props.defaultOpen)
</script>

<template>
  <Collapsible
    :open="rail || open"
    :class="cn(props.class)"
    @update:open="v => (rail ? undefined : (open = v))"
  >
    <div
      class="grid [transition:grid-template-rows_var(--hn-duration-base)_var(--hn-ease-move)]"
      :class="rail ? 'grid-rows-[0fr]' : 'grid-rows-[1fr]'"
    >
      <div class="min-h-0 overflow-hidden">
        <CollapsibleTrigger as-child>
          <Button
            variant="ghost"
            tone="neutral"
            size="sm"
            block
            :tabindex="rail ? -1 : undefined"
            class="group/sidebar-group text-muted justify-between font-medium"
          >
            {{ props.label }}
            <template #trailing>
              <ChevronRight class="hn-transition group-data-[state=open]/sidebar-group:rotate-90" />
            </template>
          </Button>
        </CollapsibleTrigger>
      </div>
    </div>
    <div
      aria-hidden="true"
      class="grid [transition:grid-template-rows_var(--hn-duration-base)_var(--hn-ease-move)]"
      :class="rail ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
    >
      <div class="min-h-0 overflow-hidden">
        <div class="border-line mx-2 my-1.5 border-t" />
      </div>
    </div>
    <CollapsibleContent>
      <div class="flex flex-col gap-0.5 pt-1">
        <slot />
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>
