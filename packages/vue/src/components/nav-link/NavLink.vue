<script setup lang="ts">
  import { computed } from 'vue'
  import { Primitive, type PrimitiveProps } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { Passthrough } from '../../lib/passthrough'
  import Tooltip from '../tooltip/Tooltip.vue'
  import { useSidebar } from '../sidebar/context'
  import { navLink, navLinkLabel } from './nav-link.variants'

  defineOptions({ name: 'HnNavLink', inheritAttrs: false })

  const props = withDefaults(
    defineProps<
      PrimitiveProps & {
        active?: boolean
        disabled?: boolean
        label?: string
        class?: string
      }
    >(),
    { as: 'a', active: false, disabled: false },
  )

  const sidebar = useSidebar()
  const rail = computed(() => sidebar?.state.value === 'rail')

  const Wrapper = sidebar ? Tooltip : Passthrough
</script>

<template>
  <Wrapper :disabled="!rail || !props.label" :content="props.label" side="right">
    <Primitive
      v-bind="$attrs"
      :as="props.as"
      :as-child="props.asChild"
      :aria-current="props.active ? 'page' : undefined"
      :data-state="props.active ? 'selected' : undefined"
      :aria-disabled="props.disabled ? 'true' : undefined"
      :data-disabled="props.disabled ? '' : undefined"
      :tabindex="props.disabled ? -1 : undefined"
      :aria-label="rail ? props.label : undefined"
      :class="cn(navLink({ active: props.active }), props.class)"
    >
      <slot name="icon" />
      <span :aria-hidden="rail ? 'true' : undefined" data-hn-label :class="navLinkLabel({ rail })">
        <slot />
      </span>
    </Primitive>
  </Wrapper>
</template>
