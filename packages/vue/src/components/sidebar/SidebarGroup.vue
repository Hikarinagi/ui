<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { cn } from '../../lib/cn'
  import Button from '../button/Button.vue'
  import DisclosureIcon from '../disclosure-icon/DisclosureIcon.vue'
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
    <div class="relative h-(--hn-control-h-sm)">
      <div
        class="hn-sidebar-label"
        :data-collapsed="rail ? '' : undefined"
        :aria-hidden="rail ? 'true' : undefined"
        :inert="rail"
      >
        <CollapsibleTrigger as-child>
          <Button
            variant="ghost"
            tone="neutral"
            size="sm"
            block
            :tabindex="rail ? -1 : undefined"
            class="text-muted justify-between font-medium"
          >
            {{ props.label }}
            <template #trailing>
              <DisclosureIcon direction="end" />
            </template>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div
        aria-hidden="true"
        class="hn-sidebar-label border-line pointer-events-none absolute inset-x-2 top-1/2 border-t"
        :data-collapsed="rail ? undefined : ''"
      />
    </div>
    <CollapsibleContent>
      <div class="flex flex-col gap-0.5 pt-1">
        <slot />
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>
