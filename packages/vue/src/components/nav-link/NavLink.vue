<script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { Passthrough } from '../../lib/passthrough'
  import Tooltip from '../tooltip/Tooltip.vue'
  import { useInSidebar, useSidebar } from '../sidebar/context'
  import { navLink, navLinkLabel } from './nav-link.variants'
  import type { PrimitiveProps } from '../../primitives/primitive'
  import { Primitive } from '../../primitives/primitive'
  import NavLinkChild from './NavLinkChild'

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

  const sidebar = useInSidebar() ? useSidebar() : null
  const rail = computed(() => sidebar?.state.value === 'rail')

  const Wrapper = sidebar ? Tooltip : Passthrough

  const linkProps = computed(() => ({
    'aria-current': props.active ? ('page' as const) : undefined,
    'data-state': props.active ? 'selected' : undefined,
    'aria-disabled': props.disabled ? ('true' as const) : undefined,
    'data-disabled': props.disabled ? '' : undefined,
    tabindex: props.disabled ? -1 : undefined,
    'aria-label': rail.value ? props.label : undefined,
    class: cn(navLink({ active: props.active }), props.class),
  }))

  const labelProps = computed(() => ({
    'aria-hidden': rail.value ? ('true' as const) : undefined,
    inert: rail.value,
    'data-collapsed': rail.value ? '' : undefined,
    'data-hn-label': '',
    class: navLinkLabel(),
  }))
</script>

<template>
  <Wrapper :disabled="!rail || !props.label" :content="props.label" side="right">
    <NavLinkChild
      v-if="props.asChild"
      v-bind="{ ...$attrs, ...linkProps }"
      :as="props.as"
      :label-props="labelProps"
    >
      <template v-if="$slots.icon" #icon><slot name="icon" /></template>
      <slot />
    </NavLinkChild>
    <Primitive
      v-else
      v-bind="$attrs"
      :as="props.as"
      :aria-current="props.active ? 'page' : undefined"
      :data-state="props.active ? 'selected' : undefined"
      :aria-disabled="props.disabled ? 'true' : undefined"
      :data-disabled="props.disabled ? '' : undefined"
      :tabindex="props.disabled ? -1 : undefined"
      :aria-label="rail ? props.label : undefined"
      :class="cn(navLink({ active: props.active }), props.class)"
    >
      <slot name="icon" />
      <span
        :aria-hidden="rail ? 'true' : undefined"
        :inert="rail"
        :data-collapsed="rail ? '' : undefined"
        data-hn-label
        :class="navLinkLabel()"
      >
        <slot />
      </span>
    </Primitive>
  </Wrapper>
</template>
