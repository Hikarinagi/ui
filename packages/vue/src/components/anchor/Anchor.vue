<script setup lang="ts">
  import { computed, onBeforeUnmount, onMounted, shallowRef, watch } from 'vue'
  import { cn } from '../../lib/cn'
  import { useUiLocale } from '../../locale'
  import Highlight from '../highlight/Highlight.vue'

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
  const visible = shallowRef<ReadonlySet<string>>(new Set())
  const linkEls = new Map<string, HTMLElement>()

  function setLink(id: string, el: unknown) {
    if (el) linkEls.set(id, el as HTMLElement)
    else linkEls.delete(id)
  }

  const entries = computed(() =>
    props.items.flatMap(item => [
      { id: item.id, label: item.label, depth: 0 },
      ...(item.children ?? []).map(child => ({ id: child.id, label: child.label, depth: 1 })),
    ]),
  )

  const covered = computed(() => entries.value.filter(entry => visible.value.has(entry.id)))
  const current = computed(() => covered.value[0]?.id)
  const rangeStart = computed(() =>
    covered.value.length ? (linkEls.get(covered.value[0]!.id) ?? null) : null,
  )
  const rangeEnd = computed(() =>
    covered.value.length ? (linkEls.get(covered.value.at(-1)!.id) ?? null) : null,
  )

  let spy: IntersectionObserver | undefined

  function targetOf(id: string) {
    return document.getElementById(id)
  }

  function observeAll() {
    spy?.disconnect()
    spy = new IntersectionObserver(
      observed => {
        const next = new Set(visible.value)
        for (const entry of observed) {
          if (entry.isIntersecting) next.add(entry.target.id)
          else next.delete(entry.target.id)
        }
        visible.value = next
      },
      { rootMargin: '0px 0px -15% 0px' },
    )
    for (const { id } of entries.value) {
      const el = targetOf(id)
      if (el) spy.observe(el)
    }
  }

  onMounted(() => {
    observeAll()
    watch(entries, () => {
      visible.value = new Set()
      observeAll()
    })
  })

  onBeforeUnmount(() => spy?.disconnect())

  function jump(event: MouseEvent, id: string) {
    const el = targetOf(id)
    if (!el) return
    event.preventDefault()
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' })
    history.replaceState(history.state, '', `#${id}`)
    visible.value = new Set([id])
  }
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
