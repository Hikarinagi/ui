<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
  import {
    ToastProvider,
    ToastPortal,
    ToastViewport,
    ToastRoot,
    ToastTitle,
    ToastDescription,
    ToastClose,
  } from 'reka-ui'
  import { CircleCheck, CircleX, TriangleAlert, Info, X } from '@lucide/vue'
  import Button from '../button/Button.vue'
  import Spinner from '../spinner/Spinner.vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import {
    toastState,
    dismiss,
    pauseTimers,
    resumeTimers,
    type ToastItem,
    type ToastTone,
    type ToasterPosition,
  } from './store'

  defineOptions({ name: 'HnToaster' })

  const props = defineProps<{
    position?: ToasterPosition
    label?: string
    class?: string
  }>()

  const t = useUiLocale()

  const icons: Partial<Record<ToastTone, unknown>> = {
    success: CircleCheck,
    danger: CircleX,
    warning: TriangleAlert,
    info: Info,
  }

  const iconColor: Partial<Record<ToastTone, string>> = {
    success: 'text-success-text',
    danger: 'text-danger-text',
    warning: 'text-warning-text',
    info: 'text-info-text',
  }

  const positionClass: Record<ToasterPosition | 'auto', string> = {
    'bottom-end': 'bottom-4 end-4',
    'bottom-start': 'bottom-4 start-4',
    'bottom-center': 'bottom-4 inset-x-0 mx-auto',
    'top-end': 'top-4 end-4',
    'top-start': 'top-4 start-4',
    'top-center': 'top-4 inset-x-0 mx-auto',
    auto: 'max-sm:bottom-4 max-sm:inset-x-0 max-sm:mx-auto sm:top-4 sm:end-4',
  }

  const VISIBLE_STACK = 3
  const GAP = 12
  const CARD_CHROME_BLOCK = 34

  const heights = reactive(new Map<number | string, number>())
  const observers = new Map<number | string, { observer: ResizeObserver; el: HTMLElement }>()
  const lastLayout = new Map<number | string, { index: number; offset: number }>()

  const expandReasons = ref(new Set<string>())
  const expanded = computed(() => expandReasons.value.size > 0)

  const openItems = computed(() => toastState.items.filter(item => item.open))

  const layout = computed(() => {
    const map = new Map<number | string, { index: number; offset: number }>()
    const open = openItems.value
    let offset = 0
    for (let i = open.length - 1; i >= 0; i -= 1) {
      const item = open[i]!
      const index = open.length - 1 - i
      map.set(item.id, { index, offset })
      offset += (heights.get(item.id) ?? 0) + GAP
    }
    for (const [id, slot] of map) lastLayout.set(id, slot)
    return map
  })

  const frontHeight = computed(() => {
    const front = openItems.value.at(-1)
    return front ? (heights.get(front.id) ?? 0) : 0
  })

  function slotOf(item: ToastItem) {
    return layout.value.get(item.id) ?? lastLayout.get(item.id) ?? { index: 0, offset: 0 }
  }

  function itemStyle(item: ToastItem) {
    const slot = slotOf(item)
    const selfHeight = heights.get(item.id)
    return {
      '--hn-t-index': String(slot.index),
      '--hn-t-offset': `${slot.offset}px`,
      ...(selfHeight ? { '--hn-t-self-h': `${selfHeight}px` } : {}),
      ...(frontHeight.value > 0 ? { '--hn-t-front-h': `${frontHeight.value}px` } : {}),
    }
  }

  function setItemRef(id: number | string, refValue: unknown) {
    const el = refValue
    if (!(el instanceof HTMLElement)) return
    const existing = observers.get(id)
    if (existing?.el === el) return
    existing?.observer.disconnect()
    const observer = new ResizeObserver(() => {
      heights.set(id, el.offsetHeight + CARD_CHROME_BLOCK)
    })
    observer.observe(el)
    heights.set(id, el.offsetHeight + CARD_CHROME_BLOCK)
    observers.set(id, { observer, el })
  }

  watch(
    () => toastState.items.length,
    () => {
      const alive = new Set(toastState.items.map(item => item.id))
      for (const [id, entry] of observers) {
        if (alive.has(id)) continue
        entry.observer.disconnect()
        observers.delete(id)
        heights.delete(id)
        lastLayout.delete(id)
      }
    },
  )

  function enter(reason: string) {
    expandReasons.value.add(reason)
    pauseTimers(reason)
  }

  function leave(reason: string) {
    expandReasons.value.delete(reason)
    resumeTimers(reason)
  }

  function onVisibility() {
    if (document.hidden) pauseTimers('hidden')
    else resumeTimers('hidden')
  }

  onMounted(() => document.addEventListener('visibilitychange', onVisibility))
  onBeforeUnmount(() => {
    document.removeEventListener('visibilitychange', onVisibility)
    for (const entry of observers.values()) entry.observer.disconnect()
    observers.clear()
  })

  function runAction(item: ToastItem, kind: 'action' | 'cancel') {
    item[kind]?.onClick?.()
    dismiss(item.id)
  }
</script>

<template>
  <ToastProvider swipe-direction="right">
    <ToastRoot
      v-for="item in toastState.items"
      :key="item.id"
      :open="true"
      :duration="Infinity"
      class="hn-toast-item group/toast outline-none"
      :style="itemStyle(item)"
      :data-hn-behind="slotOf(item).index > 0 ? '' : undefined"
      :data-hn-hidden="slotOf(item).index >= VISIBLE_STACK ? '' : undefined"
      :data-hn-removed="item.open ? undefined : ''"
      :tabindex="slotOf(item).index === 0 ? 0 : -1"
      @update:open="v => !v && dismiss(item.id)"
    >
      <div class="hn-toast-card bg-surface border-line relative rounded-lg border p-4 shadow-md">
        <div
          v-if="item.component"
          :ref="refValue => setItemRef(item.id, refValue)"
          class="hn-toast-body"
        >
          <component :is="item.component" v-bind="item.componentProps" :toast-id="item.id" />
        </div>
        <div
          v-else
          :ref="refValue => setItemRef(item.id, refValue)"
          class="hn-toast-body flex w-full items-start gap-3"
        >
          <div v-if="item.tone !== 'neutral'" class="relative mt-0.5 size-5 shrink-0">
            <Transition
              enter-active-class="hn-transition-base"
              enter-from-class="scale-90 opacity-0"
              leave-active-class="hn-transition"
              leave-to-class="scale-90 opacity-0"
            >
              <span
                v-if="item.tone === 'loading'"
                class="absolute inset-0 inline-flex items-center justify-center"
              >
                <Spinner size="md" class="text-muted" />
              </span>
              <component
                :is="icons[item.tone]"
                v-else
                :key="item.tone"
                class="absolute inset-0 size-5"
                :class="iconColor[item.tone]"
                aria-hidden="true"
              />
            </Transition>
          </div>
          <div class="flex min-w-0 flex-1 flex-col gap-1 pe-6">
            <ToastTitle class="text-fg font-medium">{{ item.message }}</ToastTitle>
            <ToastDescription v-if="item.description" class="text-muted text-sm">
              {{ item.description }}
            </ToastDescription>
            <div v-if="item.action || item.cancel" class="mt-1.5 flex gap-(--hn-inline-gap)">
              <Button
                v-if="item.cancel"
                size="sm"
                variant="ghost"
                tone="neutral"
                @click="runAction(item, 'cancel')"
              >
                {{ item.cancel.label }}
              </Button>
              <Button
                v-if="item.action"
                size="sm"
                variant="soft"
                @click="runAction(item, 'action')"
              >
                {{ item.action.label }}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ToastClose as-child>
        <Button
          icon-only
          pill
          size="sm"
          variant="ghost"
          tone="neutral"
          :aria-label="t.common.close"
          class="absolute top-2 end-2 opacity-0 group-hover/toast:opacity-100 focus-visible:opacity-100"
        >
          <X />
        </Button>
      </ToastClose>
    </ToastRoot>
    <ToastPortal>
      <ToastViewport
        :label="props.label ?? t.toast.regionLabel"
        :data-pos="props.position ?? 'auto'"
        :data-expanded="expanded ? '' : undefined"
        :class="
          cn(
            'pointer-events-none fixed z-(--hn-z-toast) w-96 max-w-[calc(100vw-2rem)] outline-none',
            positionClass[props.position ?? 'auto'],
            props.class,
          )
        "
        @pointerenter="enter('hover')"
        @pointerleave="leave('hover')"
        @focusin="enter('focus')"
        @focusout="leave('focus')"
      />
    </ToastPortal>
  </ToastProvider>
</template>
