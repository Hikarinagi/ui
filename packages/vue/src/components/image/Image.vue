<script setup lang="ts">
  import { computed, onBeforeUnmount, shallowRef, useId, watch, type StyleValue } from 'vue'
  import { cn } from '../../lib/cn'
  import { useRequiredLabel } from '../../lib/a11y'
  import Skeleton from '../skeleton/Skeleton.vue'
  import Lightbox from '../lightbox/Lightbox.vue'
  import type { LightboxItem } from '../lightbox/types'
  import {
    image,
    imageFrame,
    imagePlaceholder,
    imageRoot,
    type ImageVariants,
  } from './image.variants'
  import { useImage } from './composables/useImage'
  import { useImageGroup } from './context'
  import { useImageResolver } from './resolver'
  import { Primitive } from '../../primitives/primitive'

  defineOptions({ name: 'HnImage', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      src?: string
      alt?: string
      fallback?: string
      thumbhash?: string
      fit?: ImageVariants['fit']
      ratio?: number
      lazy?: boolean
      rootMargin?: string
      skeleton?: boolean
      eager?: boolean
      preview?: boolean | string
      previewSize?: LightboxItem['previewSize']
      draggable?: boolean
      class?: string
      style?: StyleValue
      imageClass?: string
      imageStyle?: StyleValue
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

  const {
    rootEl,
    imageEl,
    skeletonEl,
    src,
    placeholder,
    revealed,
    failed,
    showImage,
    showSkeleton,
  } = useImage(props, emit)

  const framed = computed(() => !!placeholder.value && showImage.value)

  const imageProps = computed(() => ({
    style: props.imageStyle,
    src: src.value,
    alt: props.alt,
    decoding: props.eager ? ('sync' as const) : ('async' as const),
    fetchpriority: props.eager ? ('high' as const) : undefined,
    draggable: props.draggable,
    class: cn(
      image({ fit: props.fit, lazy: props.lazy, placeholder: !!placeholder.value }),
      props.lazy && !revealed.value && 'opacity-0',
      props.lazy &&
        revealed.value &&
        placeholder.value &&
        showSkeleton.value &&
        'mix-blend-plus-lighter',
      props.imageClass,
    ),
  }))

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
    previewSize: props.previewSize,
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
    :class="cn(imageRoot({ preview: !!props.preview }), props.class)"
    :style="[props.ratio ? { aspectRatio: String(props.ratio) } : undefined, props.style]"
    @click="openPreview"
  >
    <span v-if="framed" :class="imageFrame()">
      <img ref="imageEl" v-bind="{ ...$attrs, ...imageProps }" />
      <span
        v-if="showSkeleton"
        ref="skeletonEl"
        aria-hidden="true"
        :class="
          cn(
            'pointer-events-none absolute inset-0',
            imagePlaceholder({ fit: props.fit }),
            revealed && 'will-change-transform',
          )
        "
        :style="{ backgroundImage: `url(&quot;${placeholder}&quot;)` }"
      />
    </span>
    <img v-else-if="showImage" ref="imageEl" v-bind="{ ...$attrs, ...imageProps }" />
    <slot v-else-if="failed" name="error" />
    <slot v-else name="empty" />

    <span
      v-if="showSkeleton && !framed"
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
