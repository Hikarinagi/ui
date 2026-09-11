<script setup lang="ts">
  import { nextTick, useId, watch, type ComponentPublicInstance } from 'vue'
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
  const highlightId = useId()

  function setButton(at: number, el: Element | ComponentPublicInstance | null) {
    if (el instanceof HTMLElement) buttons[at] = el
  }

  watch(
    () => [props.index, props.items.length] as const,
    async () => {
      await nextTick()
      buttons[props.index]?.scrollIntoView({
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
    <div data-hn-thumbs class="relative isolate flex w-max gap-2 px-4 py-3">
      <button
        v-for="(item, at) in props.items"
        :key="item.id"
        :ref="el => setButton(at, el)"
        type="button"
        :aria-label="item.alt"
        :aria-current="at === props.index ? 'true' : undefined"
        :class="
          cn(
            'hn-interactive hn-state-layer hn-press-none hn-transition relative z-[1] size-14 shrink-0 overflow-hidden rounded-md',
            at === props.index ? 'z-0 opacity-100' : 'opacity-60',
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
        <Highlight
          v-if="at === props.index"
          :id="highlightId"
          axis="x"
          class="ring-accent absolute inset-0 rounded-md ring-2 ring-inset"
        />
      </button>
    </div>
  </ScrollArea>
</template>
