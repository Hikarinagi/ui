<script setup lang="ts" generic="T extends AnchorItem = AnchorItem">
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Highlight from '../highlight/Highlight.vue'
  import { useAnchor } from './composables/useAnchor'
  import type { AnchorItem, AnchorSlotItem } from './types'

  export type { AnchorItem } from './types'

  defineOptions({ name: 'HnAnchor' })

  const props = defineProps<{
    items: T[]
    label?: string
    class?: string
  }>()

  defineSlots<{
    trailing?(props: { item: AnchorSlotItem<T>; active: boolean }): unknown
  }>()

  const t = useUiLocale()

  const { entries, visible, current, span, jump } = useAnchor(() => props.items)
</script>

<template>
  <nav :aria-label="props.label ?? t.anchor.navLabel" :class="cn(props.class)">
    <ul class="border-line relative grid grid-cols-1 border-s">
      <Transition
        enter-active-class="hn-transition-base"
        enter-from-class="opacity-0"
        leave-active-class="hn-transition"
        leave-to-class="opacity-0"
      >
        <Highlight
          v-if="span"
          as="li"
          axis="y"
          role="presentation"
          :style="{ gridRow: span }"
          class="bg-accent col-start-1 -ms-px w-0.5 self-stretch justify-self-start rounded-full"
        />
      </Transition>
      <li
        v-for="(entry, index) in entries"
        :key="entry.id"
        class="col-start-1"
        :style="{ gridRow: index + 1 }"
      >
        <a
          :href="`#${entry.id}`"
          :aria-current="current === entry.id ? 'location' : undefined"
          :class="
            cn(
              'hn-link flex items-center gap-(--hn-control-gap) py-1 text-sm',
              entry.depth === 0 ? 'ps-3' : 'ps-6',
              visible.has(entry.id)
                ? 'font-medium [--hn-link-color:var(--hn-fg-default)]'
                : '[--hn-link-color:var(--hn-fg-muted)]',
            )
          "
          @click="jump($event, entry.id)"
        >
          <span class="min-w-0 flex-1 wrap-break-word">{{ entry.label }}</span>
          <span v-if="$slots.trailing" class="flex shrink-0 items-center empty:hidden">
            <slot name="trailing" :item="entry.item" :active="current === entry.id" />
          </span>
        </a>
      </li>
    </ul>
  </nav>
</template>
