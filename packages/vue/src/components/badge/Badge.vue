<script setup lang="ts">
  import { computed } from 'vue'
  import VisuallyHidden from '../visually-hidden/VisuallyHidden.vue'
  import { cn } from '../../lib/cn'
  import { badge, type BadgeVariants } from './badge.variants'

  defineOptions({ name: 'HnBadge' })

  const props = withDefaults(
    defineProps<{
      content?: string | number | null
      max?: number
      tone?: BadgeVariants['tone']
      size?: BadgeVariants['size']
      placement?: BadgeVariants['placement']
      shape?: BadgeVariants['shape']
      outline?: boolean
      label?: string
      class?: string
    }>(),
    { max: 99, outline: true },
  )

  const visible = computed(
    () =>
      props.content !== undefined &&
      props.content !== null &&
      props.content !== '' &&
      props.content !== 0,
  )

  const text = computed(() =>
    typeof props.content === 'number' && props.content > props.max
      ? `${props.max}+`
      : props.content,
  )
</script>

<template>
  <span :class="cn('relative inline-flex shrink-0 align-middle', props.class)">
    <slot />
    <Transition
      enter-active-class="hn-transition-base"
      enter-from-class="scale-50 opacity-0"
      leave-active-class="hn-transition"
      leave-to-class="scale-50 opacity-0"
    >
      <span
        v-if="visible"
        :class="
          badge({
            tone: props.tone,
            size: props.size,
            placement: props.placement,
            shape: props.shape,
            outline: props.outline,
          })
        "
      >
        <slot name="content">{{ text }}</slot>
        <VisuallyHidden v-if="props.label">{{ props.label }}</VisuallyHidden>
      </span>
    </Transition>
  </span>
</template>
