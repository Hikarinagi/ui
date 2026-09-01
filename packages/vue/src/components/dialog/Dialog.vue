<script setup lang="ts">
  import {
    DialogRoot,
    DialogTrigger,
    DialogPortal,
    DialogOverlay,
    DialogContent,
    DialogTitle,
    DialogDescription,
    DialogClose,
  } from 'reka-ui'
  import CloseButton from '../close-button/CloseButton.vue'
  import Card from '../card/Card.vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import Heading from '../heading/Heading.vue'
  import Text from '../text/Text.vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import { dialogWrapper, dialogCard } from './dialog.variants'

  defineOptions({ name: 'HnDialog' })

  const props = withDefaults(
    defineProps<{
      title: string
      description?: string
      size?: 'sm' | 'md' | 'lg'
      placement?: 'center' | 'bottom'
      locked?: boolean
      class?: string
    }>(),
    { size: 'md', locked: false },
  )

  function guard(e: Event) {
    if (props.locked) e.preventDefault()
  }

  const open = defineModel<boolean>('open')
  const t = useUiLocale()

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
      <div
        :class="
          cn(
            'pointer-events-none fixed inset-0 z-(--hn-z-overlay) grid',
            dialogWrapper({ placement: props.placement ?? 'auto' }),
          )
        "
      >
        <DialogContent as-child @escape-key-down="guard" @interact-outside="guard">
          <Card
            :padded="false"
            :class="
              cn(
                'pointer-events-auto flex w-full flex-col gap-4 shadow-lg outline-none',
                'max-h-[calc(100dvh-2rem)] py-(--hn-panel-p)',
                dialogCard({ placement: props.placement ?? 'auto', size: props.size }),
                props.class,
              )
            "
          >
            <div class="flex shrink-0 items-start justify-between gap-4 px-(--hn-panel-p)">
              <div class="flex min-w-0 flex-col gap-1.5">
                <DialogTitle as-child>
                  <Heading :level="2" size="lg">{{ props.title }}</Heading>
                </DialogTitle>
                <DialogDescription v-if="props.description" as-child>
                  <Text tone="muted">{{ props.description }}</Text>
                </DialogDescription>
              </div>
              <DialogClose as-child>
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
          </Card>
        </DialogContent>
      </div>
    </DialogPortal>
  </DialogRoot>
</template>
