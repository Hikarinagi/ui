<script setup lang="ts">
  import {
    DialogRoot,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogTitle,
    DialogDescription,
    DialogClose,
  } from 'reka-ui'
  import ModalContent from './ModalContent.vue'
  import CloseButton from '../close-button/CloseButton.vue'
  import Card from '../card/Card.vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import Heading from '../heading/Heading.vue'
  import Text from '../text/Text.vue'
  import { useOverlayPortal } from '../../lib/overlay-portal'
  import { cn } from '../../lib/cn'
  import { dialogWrapper, dialogCard, type DialogVariants } from './dialog.variants'

  defineOptions({ name: 'HnDialog' })

  const props = withDefaults(
    defineProps<{
      title: string
      description?: string
      size?: DialogVariants['size']
      placement?: 'center' | 'top' | 'bottom'
      header?: boolean
      closable?: boolean
      locked?: boolean
      class?: string
    }>(),
    { size: 'md', header: true, closable: true, locked: false },
  )

  const slots = defineSlots<{
    default?(): unknown
    icon?(): unknown
    title?(): unknown
    body?(props: { close: () => void }): unknown
    content?(props: { close: () => void }): unknown
    footer?(props: { close: () => void }): unknown
  }>()

  function guard(e: Event) {
    if (props.locked) e.preventDefault()
  }

  const open = defineModel<boolean>('open')
  const { content, present } = useOverlayPortal(open)

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
      <div :class="dialogWrapper({ placement: props.placement ?? 'auto' })">
        <ModalContent as-child @escape-key-down="guard" @interact-outside="guard">
          <Card
            ref="content"
            v-bind="props.description ? {} : { 'aria-describedby': undefined }"
            :padded="false"
            :class="
              cn(
                dialogCard({
                  placement: props.placement ?? 'auto',
                  size: props.size,
                  padded: !slots.body,
                  fitViewport: true,
                }),
                props.class,
              )
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
            <slot v-if="slots.body" name="body" :close="close" />
            <template v-else>
              <div
                v-if="props.header"
                class="flex shrink-0 items-start justify-between gap-4 px-(--hn-panel-p)"
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
                <DialogClose v-if="props.closable" as-child>
                  <CloseButton :disabled="props.locked" class="-mt-1.5 -me-1.5 shrink-0" />
                </DialogClose>
              </div>
              <ScrollArea v-if="$slots.content" class="min-h-0">
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
        </ModalContent>
      </div>
    </DialogPortal>
  </DialogRoot>
</template>
