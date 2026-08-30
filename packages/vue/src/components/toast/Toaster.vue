<script setup lang="ts">
  import {
    ToastProvider,
    ToastPortal,
    ToastViewport,
    ToastRoot,
    ToastTitle,
    ToastDescription,
    ToastClose,
  } from 'reka-ui'
  import { CircleCheck, CircleX, TriangleAlert, Info } from '@lucide/vue'
  import Button from '../button/Button.vue'
  import CloseButton from '../close-button/CloseButton.vue'
  import Spinner from '../spinner/Spinner.vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import {
    toastState,
    dismiss,
    type ToastItem,
    type ToastTone,
    type ToasterPosition,
  } from './store'
  import { useToastLayout, VISIBLE_STACK } from './composables/useToastLayout'
  import { useToastExpand } from './composables/useToastExpand'

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
    'bottom-end': 'bottom-4 end-4 hn-scrollbar-safe',
    'bottom-start': 'bottom-4 start-4',
    'bottom-center': 'bottom-4 inset-x-0 mx-auto hn-scrollbar-safe-center',
    'top-end': 'top-4 end-4 hn-scrollbar-safe',
    'top-start': 'top-4 start-4',
    'top-center': 'top-4 inset-x-0 mx-auto hn-scrollbar-safe-center',
    auto: 'max-sm:bottom-4 max-sm:inset-x-0 max-sm:mx-auto max-sm:hn-scrollbar-safe-center sm:top-4 sm:end-4 sm:hn-scrollbar-safe',
  }

  const { slotOf, itemStyle, setItemRef } = useToastLayout()
  const { expanded, enter, leave } = useToastExpand()

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
        <CloseButton
          class="absolute top-2 end-2 opacity-0 group-hover/toast:opacity-100 focus-visible:opacity-100"
        />
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
