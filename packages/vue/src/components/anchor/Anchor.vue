<script setup lang="ts">
  import { computed } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Highlight from '../highlight/Highlight.vue'
  import { useScrollSpy } from './composables/useScrollSpy'

  export interface AnchorItem {
    id: string
    label: string
    children?: AnchorItem[]
  }

  defineOptions({ name: 'HnAnchor' })

  const props = defineProps<{
    items: AnchorItem[]
    label?: string
    class?: string
  }>()

  const t = useUiLocale()

  const entries = computed(() =>
    props.items.flatMap(item => [
      { id: item.id, label: item.label, depth: 0 },
      ...(item.children ?? []).map(child => ({ id: child.id, label: child.label, depth: 1 })),
    ]),
  )

  const { visible, current, span, jump } = useScrollSpy(() => entries.value)
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
              'hn-link block py-1 text-sm',
              entry.depth === 0 ? 'ps-3' : 'ps-6',
              visible.has(entry.id)
                ? 'font-medium [--hn-link-color:var(--hn-fg-default)]'
                : '[--hn-link-color:var(--hn-fg-muted)]',
            )
          "
          @click="jump($event, entry.id)"
        >
          {{ entry.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>
