<script setup lang="ts">
  import { computed } from 'vue'
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
  import { X } from '@lucide/vue'
  import Card from '../card/Card.vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import Button from '../button/Button.vue'
  import Heading from '../heading/Heading.vue'
  import Text from '../text/Text.vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'

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

  const sizeClass = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-xl' } as const

  const wrapperPlacement = computed(() => {
    if (props.placement === 'center') return 'place-items-center p-4'
    if (props.placement === 'bottom') return 'items-end justify-items-center p-4'
    return 'place-items-center p-4 max-sm:items-end max-sm:justify-items-stretch'
  })

  const cardPlacement = computed(() => {
    if (props.placement === 'center') return 'hn-anim-modal'
    if (props.placement === 'bottom') return 'hn-anim-sheet-bottom'
    return 'hn-anim-modal max-sm:hn-anim-sheet-bottom max-sm:max-w-none'
  })

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
        :class="cn('pointer-events-none fixed inset-0 z-(--hn-z-overlay) grid', wrapperPlacement)"
      >
        <DialogContent as-child @escape-key-down="guard" @interact-outside="guard">
          <Card
            :class="
              cn(
                'pointer-events-auto flex w-full flex-col gap-4 shadow-lg outline-none',
                'max-h-[calc(100dvh-2rem)]',
                cardPlacement,
                sizeClass[props.size],
                props.class,
              )
            "
          >
            <div class="flex shrink-0 items-start justify-between gap-4">
              <div class="flex min-w-0 flex-col gap-1.5">
                <DialogTitle as-child>
                  <Heading :level="2" size="lg">{{ props.title }}</Heading>
                </DialogTitle>
                <DialogDescription v-if="props.description" as-child>
                  <Text tone="muted">{{ props.description }}</Text>
                </DialogDescription>
              </div>
              <DialogClose as-child>
                <Button
                  icon-only
                  size="sm"
                  variant="ghost"
                  tone="neutral"
                  :disabled="props.locked"
                  :aria-label="t.common.close"
                  class="-mt-1.5 -me-1.5 shrink-0"
                >
                  <X />
                </Button>
              </DialogClose>
            </div>
            <ScrollArea v-if="$slots.content" class="min-h-0">
              <slot name="content" :close="close" />
            </ScrollArea>
            <div v-if="$slots.footer" class="flex shrink-0 justify-end gap-(--hn-inline-gap)">
              <slot name="footer" :close="close" />
            </div>
          </Card>
        </DialogContent>
      </div>
    </DialogPortal>
  </DialogRoot>
</template>
