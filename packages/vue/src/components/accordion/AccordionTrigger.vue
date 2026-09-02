<script setup lang="ts">
  import { AccordionHeader, AccordionTrigger as RekaAccordionTrigger } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import Ripple from '../ripple/Ripple.vue'
  import DisclosureIcon from '../disclosure-icon/DisclosureIcon.vue'
  import { accordionTrigger } from './accordion.variants'

  defineOptions({ name: 'HnAccordionTrigger' })

  const props = withDefaults(
    defineProps<{
      level?: 2 | 3 | 4 | 5 | 6
      icon?: boolean
      class?: string
    }>(),
    { level: 3, icon: true },
  )

  const slots = defineSlots<{
    default?: () => unknown
    icon?: () => unknown
  }>()
</script>

<template>
  <AccordionHeader :as="`h${props.level}`" class="m-0">
    <RekaAccordionTrigger :class="cn(accordionTrigger(), props.class)">
      <Ripple />
      <span class="min-w-0 flex-1">
        <slot />
      </span>
      <template v-if="props.icon">
        <DisclosureIcon v-if="!slots.icon" />
        <DisclosureIcon v-else>
          <slot name="icon" />
        </DisclosureIcon>
      </template>
    </RekaAccordionTrigger>
  </AccordionHeader>
</template>
