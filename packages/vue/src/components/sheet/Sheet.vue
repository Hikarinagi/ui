<script setup lang="ts">
  import { computed } from 'vue'
  import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogOverlay,
    DialogPortal,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
  } from 'reka-ui'
  import { useOverlayPortal } from '../../lib/overlay-portal'
  import { useScrollViewport } from '../../lib/scroll-viewport'
  import { cn } from '../../lib/cn'
  import Card from '../card/Card.vue'
  import CloseButton from '../close-button/CloseButton.vue'
  import Heading from '../heading/Heading.vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import Text from '../text/Text.vue'
  import { useDragToDismiss } from './composables/useDragToDismiss'
  import { sheetGrip, sheetHandle, sheetPanel } from './sheet.variants'

  defineOptions({ name: 'HnSheet' })

  const props = withDefaults(
    defineProps<{
      title: string
      description?: string
      header?: boolean
      closable?: boolean
      handle?: boolean
      locked?: boolean
      class?: string
    }>(),
    { header: true, closable: true, handle: true, locked: false },
  )

  const slots = defineSlots<{
    default?(): unknown
    icon?(): unknown
    title?(): unknown
    body?(props: { close: () => void }): unknown
    content?(props: { close: () => void }): unknown
    footer?(props: { close: () => void }): unknown
  }>()

  const { scrollArea, viewport } = useScrollViewport()
  defineExpose({ viewport })

  const open = defineModel<boolean>('open')
  const { content: panel, present } = useOverlayPortal(open)

  const { dragging, offset, onPointerDown } = useDragToDismiss(() => panel.value?.$el ?? null, {
    enabled: () => !props.locked,
    open,
    dismiss: () => (open.value = false),
  })

  const style = computed(() =>
    offset.value
      ? { transform: `translateY(${offset.value}px)`, '--hn-sheet-from-y': `${offset.value}px` }
      : undefined,
  )

  function guard(event: Event) {
    if (props.locked) event.preventDefault()
  }

  function close() {
    open.value = false
  }
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger v-if="$slots.default" as-child>
      <slot />
    </DialogTrigger>
    <DialogPortal v-if="present">
      <DialogOverlay class="hn-scrim" />
      <DialogContent as-child @escape-key-down="guard" @interact-outside="guard">
        <Card
          ref="panel"
          v-bind="props.description ? {} : { 'aria-describedby': undefined }"
          data-hn-sheet
          :data-dragging="dragging ? '' : undefined"
          :padded="false"
          :style="style"
          :class="
            cn(sheetPanel({ grip: props.header || props.handle, padded: !slots.body }), props.class)
          "
        >
          <template v-if="!props.header || slots.body">
            <DialogTitle as-child>
              <Heading :level="2" class="sr-only">{{ props.title }}</Heading>
            </DialogTitle>
            <DialogDescription v-if="props.description" class="sr-only">
              {{ props.description }}
            </DialogDescription>
          </template>
          <div
            v-if="props.handle || (props.header && !slots.body)"
            data-hn-sheet-grip
            :data-dragging="dragging ? '' : undefined"
            :class="sheetGrip({ standalone: !!slots.body })"
            @pointerdown="onPointerDown"
          >
            <div
              v-if="props.handle"
              aria-hidden="true"
              :data-disabled="props.locked ? '' : undefined"
              :class="sheetHandle({ header: props.header && !slots.body })"
            />
            <div
              v-if="props.header && !slots.body"
              class="flex items-start justify-between gap-4 px-(--hn-panel-p)"
            >
              <div class="flex min-w-0 flex-col gap-1.5">
                <div class="flex min-w-0 items-center gap-2">
                  <span
                    v-if="slots.icon"
                    class="text-muted flex shrink-0 [&_svg]:size-5"
                    aria-hidden="true"
                  >
                    <slot name="icon" />
                  </span>
                  <DialogTitle as-child>
                    <Heading :level="2" size="lg" class="min-w-0">
                      <slot name="title">{{ props.title }}</slot>
                    </Heading>
                  </DialogTitle>
                </div>
                <DialogDescription v-if="props.description" as-child>
                  <Text tone="muted">{{ props.description }}</Text>
                </DialogDescription>
              </div>
              <DialogClose v-if="!props.handle && props.closable" as-child>
                <CloseButton :disabled="props.locked" class="-mt-1.5 -me-1.5 shrink-0" />
              </DialogClose>
            </div>
          </div>
          <slot v-if="slots.body" name="body" :close="close" />
          <template v-else>
            <ScrollArea v-if="$slots.content" ref="scrollArea" class="min-h-0 grow">
              <div class="px-(--hn-panel-p) py-1">
                <slot name="content" :close="close" />
              </div>
            </ScrollArea>
            <div
              v-if="$slots.footer"
              class="flex shrink-0 justify-end gap-(--hn-inline-gap) px-(--hn-panel-p)"
            >
              <slot name="footer" :close="close" />
            </div>
          </template>
        </Card>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
