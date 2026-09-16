<script setup lang="ts">
  import { NavigationMenuTrigger as RekaNavigationMenuTrigger } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import DisclosureIcon from '../disclosure-icon/DisclosureIcon.vue'
  import { useNavigationMenu } from './context'
  import {
    navigationMenuControl,
    navigationMenuTrigger,
    navigationMenuIcon,
    navigationMenuDisclosure,
  } from './navigation-menu.variants'

  defineOptions({ name: 'HnNavigationMenuTrigger' })
  const props = defineProps<{ disabled?: boolean; class?: string }>()
  const menu = useNavigationMenu()
  defineSlots<{ default(): unknown; icon?(): unknown; trailing?(): unknown }>()
</script>

<template>
  <RekaNavigationMenuTrigger
    type="button"
    data-hn-navigation-control
    :disabled="props.disabled"
    :class="
      cn(
        navigationMenuControl({ size: menu.size.value, orientation: menu.orientation.value }),
        navigationMenuTrigger(),
        props.class,
      )
    "
  >
    <span v-if="$slots.icon" :class="navigationMenuIcon()" aria-hidden="true">
      <slot name="icon" />
    </span>
    <span class="min-w-0 flex-1"><slot /></span>
    <span :class="navigationMenuIcon()">
      <slot name="trailing">
        <span :class="navigationMenuDisclosure({ orientation: menu.orientation.value })">
          <DisclosureIcon :direction="menu.orientation.value === 'vertical' ? 'end' : 'down'" />
        </span>
      </slot>
    </span>
  </RekaNavigationMenuTrigger>
</template>
