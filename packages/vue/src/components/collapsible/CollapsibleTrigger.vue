<script setup lang="ts">
  import { CollapsibleTrigger as RekaCollapsibleTrigger } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import Button from '../button/Button.vue'
  import DisclosureIcon from '../disclosure-icon/DisclosureIcon.vue'

  defineOptions({ name: 'HnCollapsibleTrigger' })

  const props = withDefaults(
    defineProps<{
      asChild?: boolean
      icon?: boolean
      class?: string
    }>(),
    { icon: true },
  )

  const slots = defineSlots<{
    default?: () => unknown
    icon?: () => unknown
  }>()
</script>

<template>
  <RekaCollapsibleTrigger as-child :class="cn('group/hn-disclosure', props.class)">
    <slot v-if="props.asChild" />
    <Button v-else variant="ghost" tone="neutral">
      <slot />
      <template v-if="props.icon" #trailing>
        <DisclosureIcon v-if="!slots.icon" />
        <DisclosureIcon v-else>
          <slot name="icon" />
        </DisclosureIcon>
      </template>
    </Button>
  </RekaCollapsibleTrigger>
</template>
