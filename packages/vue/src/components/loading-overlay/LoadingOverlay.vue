<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import Spinner from '../spinner/Spinner.vue'
  import type { SpinnerVariants } from '../spinner/spinner.variants'
  import Text from '../text/Text.vue'
  import { useDelayedVisible } from './composables/useDelayedVisible'
  import { loadingBlocker, loadingOverlay } from './loading-overlay.variants'

  defineOptions({ name: 'HnLoadingOverlay' })

  const props = withDefaults(
    defineProps<{
      visible?: boolean
      text?: string
      fixed?: boolean
      size?: SpinnerVariants['size']
      delay?: number
      minVisible?: number
      class?: string
    }>(),
    { visible: false, fixed: false, size: 'md', delay: 300, minVisible: 300 },
  )

  const shown = useDelayedVisible(
    () => props.visible,
    () => ({ delay: props.delay, minVisible: props.minVisible }),
  )
</script>

<template>
  <div
    v-if="props.visible && !shown"
    data-hn-loading-blocker
    aria-hidden="true"
    :class="loadingBlocker({ fixed: props.fixed })"
  />
  <Transition
    enter-active-class="hn-transition-base"
    enter-from-class="opacity-0"
    leave-active-class="hn-transition"
    leave-to-class="opacity-0"
  >
    <div
      v-if="shown"
      data-hn-loading-overlay
      :class="cn(loadingOverlay({ fixed: props.fixed }), props.class)"
    >
      <slot>
        <Spinner :size="props.size" :label="props.text" />
        <Text v-if="props.text" size="sm" tone="muted" aria-hidden="true">{{ props.text }}</Text>
      </slot>
    </div>
  </Transition>
</template>
