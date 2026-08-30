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

  const { setLink, visible, current, rangeStart, rangeEnd, jump } = useScrollSpy(
    () => entries.value,
  )
</script>

<template>
  <nav :aria-label="props.label ?? t.anchor.navLabel" :class="cn(props.class)">
    <div class="border-line relative border-s">
      <Highlight
        :target="rangeStart"
        :until="rangeEnd"
        axis="y"
        class="-start-px w-0.5 rounded-full bg-accent"
      />
      <ul class="flex flex-col">
        <li v-for="entry in entries" :key="entry.id">
          <a
            :ref="el => setLink(entry.id, el)"
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
    </div>
  </nav>
</template>
