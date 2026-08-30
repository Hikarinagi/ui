<script setup lang="ts">
  import { computed } from 'vue'
  import { Primitive, type PrimitiveProps } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { Passthrough } from '../../lib/passthrough'
  import Tooltip from '../tooltip/Tooltip.vue'
  import { useSidebar } from '../sidebar/context'

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
      :class="
        cn(
          'hn-interactive hn-state-layer hn-press-none relative isolate flex cursor-pointer items-center',
          'h-9 gap-[var(--hn-control-gap)] rounded-md ps-2.5 pe-2 text-sm select-none',
          props.active ? 'text-fg font-medium' : 'text-muted',
          props.class,
        )
      "
    >
      <slot name="icon" />
      <span
        :aria-hidden="rail ? 'true' : undefined"
        data-hn-label
        :class="
          cn(
            'shrink-0 whitespace-nowrap',
            rail
              ? 'opacity-0 [transition:opacity_calc(var(--hn-duration-fast)/2)_var(--hn-ease-exit)]'
              : 'opacity-100 [transition:opacity_var(--hn-duration-fast)_var(--hn-ease-enter)]',
          )
        "
      >
        <slot />
      </span>
    </Primitive>
  </Wrapper>
</template>
