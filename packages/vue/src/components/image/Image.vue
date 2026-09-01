<script setup lang="ts">
  import { cn } from '../../lib/cn'
  import Skeleton from '../skeleton/Skeleton.vue'
  import { image, type ImageVariants } from './image.variants'
  import { useImage } from './composables/useImage'

  defineOptions({ name: 'HnImage', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      src?: string
      alt?: string
      fallback?: string
      fit?: ImageVariants['fit']
      ratio?: number
      lazy?: boolean
      rootMargin?: string
      skeleton?: boolean
      eager?: boolean
      draggable?: boolean
      class?: string
      imageClass?: string
    }>(),
    { alt: '', fit: 'cover', lazy: true, rootMargin: '200px', skeleton: true, eager: false },
  )

  const emit = defineEmits<{
    load: [size: { width: number; height: number }]
    error: []
  }>()

  const { rootEl, imageEl, skeletonEl, src, revealed, failed, showImage, showSkeleton } = useImage(
    props,
    emit,
  )
</script>

<template>
  <span
    ref="rootEl"
    :class="cn('relative block overflow-hidden', props.class)"
    :style="props.ratio ? { aspectRatio: String(props.ratio) } : undefined"
  >
    <img
      v-if="showImage"
      ref="imageEl"
      v-bind="$attrs"
      :src="src"
      :alt="props.alt"
      :decoding="props.eager ? 'sync' : 'async'"
      :fetchpriority="props.eager ? 'high' : undefined"
      :draggable="props.draggable"
      :class="
        cn(
          image({ fit: props.fit }),
          props.lazy ? !revealed && 'opacity-0' : 'relative z-10',
          props.imageClass,
        )
      "
    />
    <slot v-else-if="failed" name="error" />
    <slot v-else name="empty" />

    <span
      v-if="showSkeleton"
      ref="skeletonEl"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0"
    >
      <slot name="skeleton">
        <Skeleton class="size-full rounded-none" />
      </slot>
    </span>
  </span>
</template>
