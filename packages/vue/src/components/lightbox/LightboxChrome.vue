<script setup lang="ts">
  import { DialogClose } from 'reka-ui'
  import { Motion, type MotionValue } from 'motion-v'
  import { ChevronLeft, ChevronRight } from '@lucide/vue'
  import { useUiLocale } from '../../locale'
  import CloseButton from '../close-button/CloseButton.vue'
  import IconButton from '../icon-button/IconButton.vue'
  import Spinner from '../spinner/Spinner.vue'
  import Tag from '../tag/Tag.vue'
  import LightboxToolbar from './LightboxToolbar.vue'
  import type { LightboxItem } from './types'

  defineOptions({ name: 'HnLightboxChrome' })

  const props = defineProps<{
    items: LightboxItem[]
    index: number
    zoomed: boolean
    waiting: boolean
    loop: boolean
    presence: MotionValue<number>
    hint: { x: MotionValue<number>; y: MotionValue<number> }
  }>()

  const emit = defineEmits<{
    prev: []
    next: []
    select: [index: number]
    zoomIn: []
    zoomOut: []
    reset: []
    rotate: []
    download: []
  }>()

  const t = useUiLocale()
</script>

<template>
  <Transition
    enter-active-class="hn-transition-base"
    enter-from-class="opacity-0"
    leave-active-class="hn-transition"
    leave-to-class="opacity-0"
  >
    <Motion
      v-if="props.waiting"
      class="pointer-events-none absolute start-0 top-0 -translate-x-full p-3"
      :style="{ x: props.hint.x, y: props.hint.y }"
    >
      <Tag variant="soft" tone="neutral" pill class="whitespace-nowrap">
        <Spinner size="sm" />
        {{ t.lightbox.loadingLarge }}
      </Tag>
    </Motion>
  </Transition>
  <Motion
    v-if="props.items.length > 1"
    class="pointer-events-none absolute inset-y-0 start-0 hidden items-center ps-4 pointer-fine:flex"
    :style="{ opacity: props.presence }"
  >
    <IconButton
      :label="t.pagination.prev"
      variant="soft"
      size="lg"
      pill
      :disabled="!props.loop && props.index <= 0"
      class="pointer-events-auto"
      @click="emit('prev')"
    >
      <ChevronLeft />
    </IconButton>
  </Motion>
  <Motion
    v-if="props.items.length > 1"
    class="pointer-events-none absolute inset-y-0 end-0 hidden items-center pe-4 pointer-fine:flex"
    :style="{ opacity: props.presence }"
  >
    <IconButton
      :label="t.pagination.next"
      variant="soft"
      size="lg"
      pill
      :disabled="!props.loop && props.index >= props.items.length - 1"
      class="pointer-events-auto"
      @click="emit('next')"
    >
      <ChevronRight />
    </IconButton>
  </Motion>
  <Motion class="absolute end-4 top-4" :style="{ opacity: props.presence }">
    <DialogClose as-child>
      <CloseButton size="md" />
    </DialogClose>
  </Motion>
  <Motion
    data-hn-chrome
    class="absolute inset-x-0 bottom-0 flex touch-pan-x justify-center"
    :style="{ opacity: props.presence }"
  >
    <LightboxToolbar
      :items="props.items"
      :index="props.index"
      :zoomed="props.zoomed"
      @select="emit('select', $event)"
      @zoom-in="emit('zoomIn')"
      @zoom-out="emit('zoomOut')"
      @reset="emit('reset')"
      @rotate="emit('rotate')"
      @download="emit('download')"
    />
  </Motion>
</template>
