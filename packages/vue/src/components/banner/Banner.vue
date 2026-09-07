<script setup lang="ts" generic="T">
  import { ChevronLeft, ChevronRight } from '@lucide/vue'
  import { computed, ref, watch } from 'vue'
  import { cn } from '../../lib/cn'
  import { useCollapseHooks } from '../../lib/collapse'
  import { useUiLocale } from '../../locale'
  import CloseButton from '../close-button/CloseButton.vue'
  import IconButton from '../icon-button/IconButton.vue'
  import {
    banner,
    bannerActions,
    bannerContent,
    bannerControls,
    bannerCounter,
    bannerIcon,
    bannerItem,
    bannerSlide,
    type BannerVariants,
  } from './banner.variants'
  import { useAutoplay } from './composables/useAutoplay'
  import { bannerIcons } from './icons'
  import type { BannerNotice } from './types'
  import { stepBetween } from './utils/direction'

  defineOptions({ name: 'HnBanner' })

  const props = withDefaults(
    defineProps<{
      tone?: BannerVariants['tone']
      icon?: boolean
      closable?: boolean
      items?: T[]
      autoplay?: number
      class?: string
    }>(),
    { tone: 'accent', icon: true },
  )

  const open = defineModel<boolean>('open', { default: true })
  const index = defineModel<number>('index', { default: 0 })

  const emit = defineEmits<{ close: [] }>()

  const slots = defineSlots<{
    default?(): unknown
    icon?(): unknown
    actions?(): unknown
    item?(props: { item: T; index: number }): unknown
  }>()

  const t = useUiLocale()
  const hooks = useCollapseHooks()

  const count = computed(() => props.items?.length ?? 0)
  const multiple = computed(() => count.value > 1)
  const at = computed(() =>
    count.value ? ((index.value % count.value) + count.value) % count.value : 0,
  )
  const current = computed(() => props.items?.[at.value])
  const notice = computed(() => current.value as BannerNotice | undefined)
  const tone = computed(() => notice.value?.tone ?? props.tone)
  const icon = computed(() => notice.value?.icon ?? bannerIcons[tone.value])

  const direction = ref<1 | -1>(1)
  let pending: 1 | -1 | undefined

  watch(index, (next, previous) => {
    direction.value = pending ?? stepBetween(previous, next, count.value)
    pending = undefined
  })

  const slide = computed(() => bannerSlide[direction.value > 0 ? 'forward' : 'backward'])

  function go(step: 1 | -1) {
    pending = step
    index.value = (at.value + step + count.value) % count.value
  }

  const autoplay = useAutoplay(
    () => props.autoplay,
    () => multiple.value && open.value,
    () => go(1),
  )

  function close() {
    open.value = false
    emit('close')
  }
</script>

<template>
  <Transition
    enter-from-class="hn-collapse-closed"
    enter-to-class="hn-collapse-open"
    leave-from-class="hn-collapse-open"
    leave-to-class="hn-collapse-closed"
    v-on="hooks"
  >
    <div v-if="open" data-hn-banner class="hn-collapse w-full">
      <div class="hn-collapse-body">
        <div
          :data-tone="tone"
          :class="cn(banner({ tone }), props.class)"
          @pointerenter="autoplay.hovered.value = true"
          @pointerleave="autoplay.hovered.value = false"
          @focusin="autoplay.focused.value = true"
          @focusout="autoplay.focused.value = false"
        >
          <div :class="bannerContent()">
            <span
              v-if="props.items"
              :aria-live="multiple && !props.autoplay ? 'polite' : undefined"
              class="flex min-w-0 items-center"
            >
              <Transition
                mode="out-in"
                enter-active-class="hn-transition-base"
                :enter-from-class="slide.enterFrom"
                leave-active-class="hn-transition"
                :leave-to-class="slide.leaveTo"
              >
                <span :key="at" :class="bannerItem()">
                  <slot name="icon">
                    <component
                      :is="icon"
                      v-if="props.icon"
                      :class="bannerIcon()"
                      aria-hidden="true"
                    />
                  </slot>
                  <slot name="item" :item="current as T" :index="at" />
                </span>
              </Transition>
            </span>
            <template v-else>
              <slot name="icon">
                <component :is="icon" v-if="props.icon" :class="bannerIcon()" aria-hidden="true" />
              </slot>
              <slot />
            </template>
            <div v-if="slots.actions" :class="bannerActions()">
              <slot name="actions" />
            </div>
          </div>
          <div v-if="multiple || props.closable" :class="bannerControls()">
            <template v-if="multiple">
              <IconButton
                size="sm"
                pill
                variant="ghost"
                tone="neutral"
                :tooltip="false"
                :label="t.banner.prev"
                class="text-current"
                @click="go(-1)"
              >
                <ChevronLeft />
              </IconButton>
              <span :class="bannerCounter()">{{ at + 1 }} / {{ count }}</span>
              <IconButton
                size="sm"
                pill
                variant="ghost"
                tone="neutral"
                :tooltip="false"
                :label="t.banner.next"
                class="text-current"
                @click="go(1)"
              >
                <ChevronRight />
              </IconButton>
            </template>
            <CloseButton v-if="props.closable" size="sm" class="text-current" @click="close" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
