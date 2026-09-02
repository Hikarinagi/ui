<script setup lang="ts">
  import { computed, onBeforeUnmount, shallowRef, useId, watch } from 'vue'
  import { Primitive } from 'reka-ui'
  import { cn } from '../../lib/cn'
  import { useRequiredLabel } from '../../lib/a11y'
  import Skeleton from '../skeleton/Skeleton.vue'
  import Lightbox from '../lightbox/Lightbox.vue'
  import type { LightboxItem } from '../lightbox/types'
  import { image, type ImageVariants } from './image.variants'
  import { useImage } from './composables/useImage'
  import { useImageGroup } from './context'
  import { useImageResolver } from './resolver'

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
      preview?: boolean | string
      draggable?: boolean
      class?: string
      imageClass?: string
    }>(),
    {
      alt: '',
      fit: 'cover',
      lazy: true,
      rootMargin: '200px',
      skeleton: true,
      eager: false,
      preview: false,
    },
  )

  const emit = defineEmits<{
    load: [size: { width: number; height: number }]
    error: []
  }>()

  const { rootEl, imageEl, skeletonEl, src, revealed, failed, showImage, showSkeleton } = useImage(
    props,
    emit,
  )

  useRequiredLabel('Image', () => !props.preview || !!props.alt, '替代文本')

  const resolve = useImageResolver()
  const previewOpen = shallowRef(false)
  const previewId = useId()
  const previewItem = computed<LightboxItem>(() => ({
    id: previewId,
    src: src.value ?? '',
    preview: resolve(
      typeof props.preview === 'string' ? props.preview : (props.src ?? ''),
      'preview',
    ),
    alt: props.alt,
    fit: props.fit,
    source: () => imageEl.value,
  }))

  const group = useImageGroup()

  if (group) {
    watch(
      () => !!props.preview,
      on => {
        if (on) group.register(previewId, () => previewItem.value)
        else group.unregister(previewId)
      },
      { immediate: true },
    )
    onBeforeUnmount(() => group.unregister(previewId))
  }

  function openPreview() {
    if (!props.preview || !showImage.value || !src.value) return
    if (group) group.open(previewId)
    else previewOpen.value = true
  }
</script>

<template>
  <Primitive
    ref="rootEl"
    :as="props.preview ? 'button' : 'span'"
    :type="props.preview ? 'button' : undefined"
    :class="
      cn(
        'relative block overflow-hidden',
        props.preview && 'hn-focus-ring cursor-zoom-in',
        props.class,
      )
    "
    :style="props.ratio ? { aspectRatio: String(props.ratio) } : undefined"
    @click="openPreview"
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
    <Lightbox v-if="props.preview && !group" v-model:open="previewOpen" :items="[previewItem]" />
  </Primitive>
</template>
