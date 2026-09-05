<script setup lang="ts">
  import { computed, shallowRef } from 'vue'
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
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
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
      handle?: boolean
      locked?: boolean
      class?: string
    }>(),
    { handle: true, locked: false },
  )

  const open = defineModel<boolean>('open')
  const t = useUiLocale()
  const panel = shallowRef<{ $el: HTMLElement } | null>(null)

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
    <DialogPortal>
      <DialogOverlay class="hn-scrim" />
      <DialogContent as-child @escape-key-down="guard" @interact-outside="guard">
        <Card
          ref="panel"
          data-hn-sheet
          :data-dragging="dragging ? '' : undefined"
          :padded="false"
          :style="style"
          :class="cn(sheetPanel(), props.class)"
        >
          <div
            data-hn-sheet-grip
            :data-dragging="dragging ? '' : undefined"
            :class="sheetGrip()"
            @pointerdown="onPointerDown"
          >
            <div
              v-if="props.handle"
              aria-hidden="true"
              :data-disabled="props.locked ? '' : undefined"
              :class="sheetHandle()"
            />
            <div class="flex items-start justify-between gap-4 px-(--hn-panel-p)">
              <div class="flex min-w-0 flex-col gap-1.5">
                <DialogTitle as-child>
                  <Heading :level="2" size="lg">{{ props.title }}</Heading>
                </DialogTitle>
                <DialogDescription v-if="props.description" as-child>
                  <Text tone="muted">{{ props.description }}</Text>
                </DialogDescription>
              </div>
              <DialogClose v-if="!props.handle" as-child>
                <CloseButton :disabled="props.locked" class="-mt-1.5 -me-1.5 shrink-0" />
              </DialogClose>
            </div>
          </div>
          <ScrollArea v-if="$slots.content" class="min-h-0 grow">
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
        </Card>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
