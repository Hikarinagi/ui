<script setup lang="ts">
  import { computed, toRef } from 'vue'
  import { NavigationMenuRoot, NavigationMenuList, NavigationMenuViewport } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useAccessibleName } from '../../lib/a11y'
  import { useDirection } from '../../lib/useDirection'
  import { provideNavigationMenu } from './context'
  import { useNavigationMenuKeyboard } from './composables/useNavigationMenuKeyboard'
  import { useNavigationMenuLayout } from './composables/useNavigationMenuLayout'
  import {
    navigationMenu,
    navigationMenuList,
    navigationMenuViewport,
  } from './navigation-menu.variants'
  import type { NavigationMenuProps } from './types'

  defineOptions({ name: 'HnNavigationMenu' })
  const props = withDefaults(defineProps<NavigationMenuProps>(), {
    orientation: 'horizontal',
    size: 'md',
    trigger: 'hover',
    delayDuration: 200,
    skipDelayDuration: 300,
    align: 'center',
    unmountOnHide: true,
  })
  const model = defineModel<string>({ default: '' })
  const { root, direction, rootDirection } = useDirection(() => props.dir)
  const onKeydown = useNavigationMenuKeyboard(
    root,
    () => props.orientation,
    () => direction.value,
  )
  const { side, placement, style } = useNavigationMenuLayout(
    root,
    () => props.orientation,
    () => direction.value,
  )
  const align = computed(() =>
    props.orientation === 'horizontal' && direction.value === 'rtl' && props.align !== 'center'
      ? props.align === 'start'
        ? 'end'
        : 'start'
      : props.align,
  )
  provideNavigationMenu({ size: toRef(props, 'size'), orientation: toRef(props, 'orientation') })
  useAccessibleName('NavigationMenu', () => !props.label)
  defineSlots<{ default(props: { value: string }): unknown }>()
</script>

<template>
  <NavigationMenuRoot
    :key="props.orientation"
    v-model="model"
    as-child
    :orientation="props.orientation"
    :dir="direction"
    :delay-duration="props.delayDuration"
    :skip-delay-duration="props.skipDelayDuration"
    :disable-hover-trigger="props.trigger === 'click'"
    :disable-pointer-leave-close="props.trigger === 'click'"
    :unmount-on-hide="props.unmountOnHide"
    :aria-label="props.label"
    :class="cn(navigationMenu(), props.class)"
    @keydown.capture="onKeydown"
  >
    <nav ref="root" :dir="rootDirection" :style="style" data-hn-navigation-menu>
      <NavigationMenuList
        data-hn-navigation-list
        :class="cn(navigationMenuList({ orientation: props.orientation }), props.listClass)"
      >
        <slot :value="model" />
      </NavigationMenuList>
      <NavigationMenuViewport
        data-hn-navigation-viewport
        :align="align"
        :data-side="placement"
        :class="
          cn(navigationMenuViewport({ orientation: props.orientation, side }), props.viewportClass)
        "
      />
    </nav>
  </NavigationMenuRoot>
</template>
