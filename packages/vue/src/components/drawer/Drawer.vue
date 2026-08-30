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
  import { drawerCard } from './drawer.variants'

  defineOptions({ name: 'HnDrawer' })

  const props = withDefaults(
    defineProps<{
      title: string
      description?: string
      side?: 'start' | 'end'
      size?: 'sm' | 'md' | 'lg'
      locked?: boolean
      class?: string
    }>(),
    { side: 'end', size: 'md', locked: false },
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
      <DialogContent as-child @escape-key-down="guard" @interact-outside="guard">
        <Card
          :data-hn-side="props.side"
          :class="
            cn(
              'hn-anim-drawer pointer-events-auto fixed inset-y-0 z-(--hn-z-overlay) flex flex-col gap-4',
              'max-w-[calc(100vw-3rem)] rounded-none shadow-lg outline-none',
              drawerCard({ side: props.side, size: props.size }),
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
              <CloseButton :disabled="props.locked" class="-mt-1.5 -me-1.5 shrink-0" />
            </DialogClose>
          </div>
          <ScrollArea v-if="$slots.content" class="min-h-0 grow">
            <slot name="content" :close="close" />
          </ScrollArea>
          <div v-if="$slots.footer" class="flex shrink-0 justify-end gap-(--hn-inline-gap)">
            <slot name="footer" :close="close" />
          </div>
        </Card>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
