<script setup lang="ts">
  import { type ComponentPublicInstance } from 'vue'
  import { PopoverRoot, PopoverPortal } from 'reka-ui'
  import PopoverContent from '../popover/PopoverContent.vue'
  import Card from '../card/Card.vue'
  import Button from '../button/Button.vue'
  import ScrollArea from '../scroll-area/ScrollArea.vue'
  import { useOverlayPortal } from '../../lib/overlay-portal'
  import { useUiLocale } from '../../locale'
  import { usePaginationContext } from './context'
  import { usePaginationWindow } from './composables/usePaginationWindow'
  import type { PaginationEllipsisController } from './composables/usePaginationEllipsis'
  defineOptions({ name: 'HnPaginationPopup' })
  const props = defineProps<{ controller: PaginationEllipsisController }>()
  const { open, reference, id } = props.controller
  const { size, blocked, direction } = usePaginationContext()
  const { content, present } = useOverlayPortal(open)
  const { scroll, rowsHost, activePage, extent, rows, keydown } = usePaginationWindow(
    props.controller,
  )
  const t = useUiLocale()
  function panel(value: Element | ComponentPublicInstance | null) {
    content.value = value as ComponentPublicInstance | null
    props.controller.panel.value = value && '$el' in value ? value.$el : undefined
  }
</script>

<template>
  <PopoverRoot
    :open="open"
    :modal="false"
    @update:open="
      value => {
        if (!value) props.controller.close()
      }
    "
  >
    <PopoverPortal v-if="present">
      <PopoverContent
        :id="id"
        :reference="reference"
        :side-offset="8"
        align="center"
        :aria-label="t.pagination.choosePage"
        as-child
        @open-auto-focus.prevent
        @close-auto-focus="props.controller.closeAutoFocus"
        @interact-outside="props.controller.outside"
        @escape-key-down.prevent="props.controller.close(true)"
      >
        <Card
          :ref="panel"
          :padded="false"
          :dir="direction"
          :inert="!open || blocked || undefined"
          data-hn-pagination-popup
          class="hn-anim-pop z-(--hn-z-overlay) w-24 p-1 shadow-md outline-none"
          @pointerenter="props.controller.keep"
          @pointerleave="props.controller.leave"
          @keydown="keydown"
          @keydown.tab.capture="props.controller.tab"
        >
          <ScrollArea ref="scroll" class="max-h-56">
            <div ref="rowsHost" class="relative gap-1" :style="{ height: extent + 'px' }">
              <div
                v-for="row in rows"
                :key="row.page"
                class="absolute inset-x-0"
                :style="{ top: row.top + 'px' }"
              >
                <Button
                  :data-hn-pagination-choice="row.page"
                  variant="ghost"
                  tone="neutral"
                  :size="size"
                  :disabled="blocked"
                  :tabindex="activePage === row.page ? 0 : -1"
                  :aria-label="t.pagination.pageLabel(row.page)"
                  class="w-full tabular-nums"
                  @focus="activePage = row.page"
                  @click="props.controller.pick(row.page)"
                >
                  {{ row.page }}
                </Button>
              </div>
            </div>
          </ScrollArea>
        </Card>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
