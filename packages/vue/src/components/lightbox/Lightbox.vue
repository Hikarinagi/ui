<script setup lang="ts">
  import { computed, onMounted, shallowRef, watch } from 'vue'
  import { DialogRoot, DialogPortal, DialogContent, DialogTitle, useBodyScrollLock } from 'reka-ui'
  import { Motion } from 'motion-v'
  import { useEventListener } from '@vueuse/core'
  import { cn } from '../../lib/cn'
  import VisuallyHidden from '../visually-hidden/VisuallyHidden.vue'
  import LightboxStrip from './LightboxStrip.vue'
  import LightboxChrome from './LightboxChrome.vue'
  import { useLightboxMotion } from './composables/useLightboxMotion'
  import { useLightboxZoom } from './composables/useLightboxZoom'
  import { useLightboxGesture } from './composables/useLightboxGesture'
  import { useLightboxPaging } from './composables/useLightboxPaging'
  import { useLightboxFrames } from './composables/useLightboxFrames'
  import { useLightboxLarge } from './composables/useLightboxLarge'
  import { useLightboxPose } from './composables/useLightboxPose'
  import { useLightboxPhase } from './composables/useLightboxPhase'
  import { useLightboxHint } from './composables/useLightboxHint'
  import { useLightboxSlides } from './composables/useLightboxSlides'
  import { useLightboxRotation } from './composables/useLightboxRotation'
  import { clampIndex } from './utils/paging'
  import { saveImage } from './utils/download'
  import type { LightboxItem } from './types'

  defineOptions({ name: 'HnLightbox' })

  const props = defineProps<{
    items: LightboxItem[]
    loop?: boolean
    class?: string
  }>()

  const open = defineModel<boolean>('open', { default: false })
  const index = defineModel<number>('index', { default: 0 })

  const mounted = shallowRef(false)
  const stageEl = shallowRef<HTMLElement>()
  const count = computed(() => props.items.length)
  const current = computed(() => props.items[index.value])

  const frames = useLightboxFrames(() => props.items)
  const pose = useLightboxPose(frames, () => current.value)
  const rotation = useLightboxRotation(frames, () => current.value)
  const locked = useBodyScrollLock(false)

  const motion = useLightboxMotion(
    () => frames.stage.value.height,
    () => rotation.baseOf(current.value),
  )

  const zoom = useLightboxZoom(motion, rotation.geometry)

  const paging = useLightboxPaging({
    index,
    count: () => count.value,
    width: () => frames.stage.value.width,
    loop: () => !!props.loop,
  })

  function measure() {
    frames.measure(stageEl.value)
    paging.sync()
  }

  const phase = useLightboxPhase({
    open,
    mounted,
    locked,
    motion,
    pose: pose.fromSource,
    prepare: () => {
      rotation.clear()
      frames.read()
    },
    layout: measure,
  })

  const close = phase.close

  const gesture = useLightboxGesture({
    stage: () => stageEl.value,
    motion,
    zoom,
    paging,
    enabled: () => phase.current() === 'open',
    interrupt: phase.interrupt,
    inside: target => target instanceof Element && !!target.closest('[data-hn-frame]'),
    dismiss: () => void close(),
    tapOutside: () => void close(),
  })

  const large = useLightboxLarge(
    () => current.value,
    () => mounted.value,
  )

  const hint = useLightboxHint({ motion, frames, paging, current: () => current.value })

  const looping = computed(() => !!props.loop && count.value > 1)
  const slides = useLightboxSlides(
    paging,
    () => props.items,
    () => looping.value,
  )

  function go(to: number) {
    if (zoom.isZoomed()) zoom.reset()
    paging.go(to)
  }

  function rotate() {
    if (phase.current() === 'open') motion.turn(rotation.advance())
  }

  function download() {
    const item = current.value
    if (item) void saveImage(item.preview || item.src)
  }

  watch(open, value => {
    if (value) void phase.show()
    else void close()
  })

  watch(index, (to, from) => {
    rotation.drop(props.items[from])
    motion.reset(rotation.rotationOf(props.items[to]))
  })

  watch(count, () => {
    const clamped = clampIndex(index.value, count.value)
    if (clamped !== index.value) index.value = clamped
    if (mounted.value) paging.sync()
  })

  onMounted(() => {
    if (open.value) void phase.show()
  })

  useEventListener('resize', () => {
    if (mounted.value) measure()
  })

  function onEscape(event: Event) {
    event.preventDefault()
    void close()
  }

  function onKeydown(event: KeyboardEvent) {
    if (phase.current() !== 'open') return
    if (event.key === 'ArrowLeft') go(index.value - 1)
    else if (event.key === 'ArrowRight') go(index.value + 1)
    else return
    event.preventDefault()
  }

  const currentStyle = computed(() => {
    const frame = frames.frameOf(current.value)
    return {
      left: `${frame.x}px`,
      top: `${frame.y}px`,
      width: `${frame.width}px`,
      height: `${frame.height}px`,
      x: motion.x,
      y: motion.y,
      scale: motion.scale,
      rotate: motion.rotate,
      clipPath: motion.clipPath,
      opacity: motion.opacity,
    }
  })

  const currentClass = computed(() =>
    cn(
      'absolute will-change-transform',
      !zoom.zoomed.value && 'cursor-zoom-in',
      zoom.zoomed.value && (gesture.mode.value === 'pan' ? 'cursor-grabbing' : 'cursor-grab'),
    ),
  )
</script>

<template>
  <DialogRoot :open="mounted" @update:open="value => !value && close()">
    <DialogPortal>
      <DialogContent
        as-child
        :aria-describedby="undefined"
        @escape-key-down="onEscape"
        @interact-outside="event => event.preventDefault()"
      >
        <div
          ref="stageEl"
          :data-hn-phase="phase.current()"
          :class="
            cn(
              'dark fixed inset-0 z-(--hn-z-overlay) touch-none outline-none select-none',
              props.class,
            )
          "
          @pointerdown="gesture.onPointerdown"
          @pointermove="gesture.onPointermove"
          @pointerup="gesture.onPointerup"
          @pointercancel="gesture.onPointercancel"
          @wheel="gesture.onWheel"
          @keydown="onKeydown"
        >
          <div aria-hidden="true" class="pointer-events-none absolute inset-0 isolate">
            <Motion class="hn-scrim" :style="{ opacity: motion.presence }" />
          </div>
          <LightboxStrip
            :slides="slides"
            :index="paging.position.value"
            :width="frames.stage.value.width"
            :strip-x="paging.stripX"
            :current-class="currentClass"
            :current-style="currentStyle"
            :frame-of="frames.frameOf"
            :rotation-of="rotation.rotationOf"
            :base-of="rotation.baseOf"
            :transition="motion.transition('base')"
            :large-src="large.src.value"
            :large-ready="large.ready.value"
            @learn="frames.learn"
          />
          <DialogTitle as-child>
            <VisuallyHidden>{{ current?.alt }}</VisuallyHidden>
          </DialogTitle>
          <LightboxChrome
            :items="props.items"
            :index="index"
            :zoomed="zoom.zoomed.value"
            :waiting="large.waiting.value"
            :loop="looping"
            :hint="hint"
            :presence="motion.presence"
            @prev="go(index - 1)"
            @next="go(index + 1)"
            @select="go"
            @zoom-in="zoom.step(1)"
            @zoom-out="zoom.step(-1)"
            @reset="zoom.reset()"
            @rotate="rotate"
            @download="download"
          />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
