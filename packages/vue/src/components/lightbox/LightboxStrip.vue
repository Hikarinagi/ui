<script setup lang="ts">
  import { Motion, type MotionValue, type ValueAnimationTransition } from 'motion-v'
  import type { Rect } from './utils/pose'
  import type { LightboxItem } from './types'

  defineOptions({ name: 'HnLightboxStrip' })

  const props = defineProps<{
    slides: { item: LightboxItem; at: number; key: string }[]
    index: number
    width: number
    stripX: MotionValue<number>
    currentClass: string
    currentStyle: Record<string, unknown>
    frameOf: (item: LightboxItem) => Rect
    rotationOf: (item: LightboxItem) => number
    baseOf: (item: LightboxItem) => number
    transition: ValueAnimationTransition
    largeSrc?: string
    largeReady: boolean
  }>()

  const emit = defineEmits<{ learn: [id: string, image: HTMLImageElement] }>()

  function px(rect: Rect) {
    return {
      left: `${rect.x}px`,
      top: `${rect.y}px`,
      width: `${rect.width}px`,
      height: `${rect.height}px`,
    }
  }
</script>

<template>
  <Motion class="absolute inset-0" :style="{ x: props.stripX }">
    <div
      v-for="slide in props.slides"
      :key="slide.key"
      class="absolute inset-y-0"
      :style="{ left: `${slide.at * props.width}px`, width: `${props.width}px` }"
    >
      <Motion
        v-if="slide.at === props.index"
        data-hn-frame
        :class="props.currentClass"
        :style="props.currentStyle"
      >
        <img
          :src="slide.item.src"
          :alt="slide.item.alt"
          draggable="false"
          class="block size-full object-contain"
          @load="emit('learn', slide.item.id, $event.target as HTMLImageElement)"
        />
        <Transition
          enter-active-class="hn-transition-base"
          enter-from-class="opacity-0"
          leave-active-class="hn-transition"
          leave-to-class="opacity-0"
        >
          <img
            v-if="props.largeReady"
            :src="props.largeSrc"
            alt=""
            aria-hidden="true"
            draggable="false"
            class="absolute inset-0 size-full object-contain"
          />
        </Transition>
      </Motion>
      <Motion
        v-else
        data-hn-frame
        class="absolute"
        :style="px(props.frameOf(slide.item))"
        :initial="false"
        :animate="{ rotate: props.rotationOf(slide.item), scale: props.baseOf(slide.item) }"
        :transition="props.transition"
      >
        <img
          :src="slide.item.src"
          :alt="slide.item.alt"
          draggable="false"
          class="block size-full object-contain"
          @load="emit('learn', slide.item.id, $event.target as HTMLImageElement)"
        />
      </Motion>
    </div>
  </Motion>
</template>
