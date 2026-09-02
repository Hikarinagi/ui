<script setup lang="ts">
  import { nextTick, shallowRef, watch, type ComponentPublicInstance } from 'vue'
  import { cn } from '../../lib/cn'
  import { prefersReducedMotion } from '../../motion'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import Highlight from '../highlight/Highlight.vue'
  import Ripple from '../ripple/Ripple.vue'
  import type { LightboxItem } from './types'

  defineOptions({ name: 'HnLightboxThumbs' })

  const props = defineProps<{
    items: LightboxItem[]
    index: number
  }>()

  const emit = defineEmits<{ select: [index: number] }>()

  const buttons: HTMLElement[] = []
  const active = shallowRef<HTMLElement | null>(null)

  function setButton(at: number, el: Element | ComponentPublicInstance | null) {
    if (el instanceof HTMLElement) buttons[at] = el
  }

  watch(
    () => [props.index, props.items.length] as const,
    async () => {
      await nextTick()
      const el = buttons[props.index] ?? null
      active.value = el
      el?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    },
    { immediate: true, flush: 'post' },
  )
</script>

<template>
  <ScrollArea direction="horizontal" :scrollbar="false" class="max-w-full">
    <div data-hn-thumbs class="relative flex w-max gap-2 px-4 py-3">
      <Highlight :target="active" class="rounded-md ring-2 ring-accent" />
      <button
        v-for="(item, at) in props.items"
        :key="item.id"
        :ref="el => setButton(at, el)"
        type="button"
        :aria-label="item.alt"
        :aria-current="at === props.index ? 'true' : undefined"
        :class="
          cn(
            'hn-interactive hn-state-layer hn-press-none hn-transition size-14 shrink-0 overflow-hidden rounded-md',
            at === props.index ? 'opacity-100' : 'opacity-60',
          )
        "
        @click="emit('select', at)"
      >
        <Ripple />
        <img
          :src="item.src"
          alt=""
          draggable="false"
          class="relative -z-10 size-full object-cover"
        />
      </button>
    </div>
  </ScrollArea>
</template>
