<script setup lang="ts">
  import { toRef } from 'vue'
  import { ToolbarRoot } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useAccessibleName } from '../../lib/a11y'
  import { useDirection } from '../../lib/useDirection'
  import { provideToolbar } from './context'
  import { toolbar } from './toolbar.variants'
  import type { ToolbarProps } from './types'

  defineOptions({ name: 'HnToolbar' })

  const props = withDefaults(defineProps<ToolbarProps>(), {
    orientation: 'horizontal',
    loop: true,
    disabled: false,
    size: 'md',
    variant: 'primary',
  })
  const { root, direction, rootDirection } = useDirection(() => props.dir)

  provideToolbar({
    orientation: toRef(props, 'orientation'),
    size: toRef(props, 'size'),
    disabled: toRef(props, 'disabled'),
  })
  useAccessibleName('Toolbar', () => !props.label)
  defineSlots<{ default(): unknown }>()
</script>

<template>
  <ToolbarRoot
    as-child
    :orientation="props.orientation"
    :dir="direction"
    :loop="props.loop"
    :aria-label="props.label"
    :aria-disabled="props.disabled || undefined"
    :class="cn(toolbar({ orientation: props.orientation, variant: props.variant }), props.class)"
  >
    <div ref="root" :dir="rootDirection" data-hn-toolbar>
      <slot />
    </div>
  </ToolbarRoot>
</template>
