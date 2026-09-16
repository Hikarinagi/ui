<script setup lang="ts">
  import {
    NavigationMenuLink as RekaNavigationMenuLink,
    type NavigationMenuLinkEmits,
    type PrimitiveProps,
  } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useNavigationMenu } from './context'
  import {
    navigationMenuControl,
    navigationMenuLink,
    navigationMenuIcon,
  } from './navigation-menu.variants'

  defineOptions({ name: 'HnNavigationMenuLink', inheritAttrs: false })
  const props = withDefaults(
    defineProps<
      PrimitiveProps & {
        active?: boolean
        disabled?: boolean
        description?: string
        class?: string
      }
    >(),
    { as: 'a' },
  )
  const emit = defineEmits<NavigationMenuLinkEmits>()
  const menu = useNavigationMenu()
  defineSlots<{
    default(): unknown
    icon?(): unknown
    trailing?(): unknown
    description?(): unknown
  }>()

  function guard(event: MouseEvent) {
    if (!props.disabled) return
    event.preventDefault()
    event.stopImmediatePropagation()
  }
</script>

<template>
  <RekaNavigationMenuLink
    v-bind="$attrs"
    :as="props.as"
    :as-child="props.asChild"
    :active="props.active"
    :aria-disabled="props.disabled || undefined"
    :data-disabled="props.disabled ? '' : undefined"
    :tabindex="props.disabled ? -1 : undefined"
    data-hn-navigation-control
    :class="
      cn(
        navigationMenuControl({ size: menu.size.value, orientation: menu.orientation.value }),
        navigationMenuLink(),
        props.class,
      )
    "
    @click.capture="guard"
    @select="emit('select', $event)"
  >
    <slot v-if="props.asChild" />
    <template v-else>
      <span v-if="$slots.icon" :class="navigationMenuIcon()" aria-hidden="true">
        <slot name="icon" />
      </span>
      <span class="flex min-w-0 flex-1 flex-col gap-1">
        <span><slot /></span>
        <span
          v-if="props.description || $slots.description"
          class="text-muted text-xs leading-relaxed font-normal"
        >
          <slot name="description">{{ props.description }}</slot>
        </span>
      </span>
      <span v-if="$slots.trailing" :class="navigationMenuIcon()">
        <slot name="trailing" />
      </span>
    </template>
  </RekaNavigationMenuLink>
</template>
