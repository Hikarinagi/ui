<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Highlight, Inline } from '@hina-ui/vue'

  const items = ['All', 'Galgame', 'Light novels', 'Manga']
  const current = ref(0)
  const tabs = ref<HTMLElement[]>([])

  function setRef(instance: unknown, index: number) {
    const el =
      instance && typeof instance === 'object' && '$el' in instance
        ? (instance as { $el: unknown }).$el
        : instance
    if (el instanceof HTMLElement) tabs.value[index] = el
  }
</script>

<template>
  <Inline gap="none" class="border-line relative isolate rounded-lg border p-1">
    <Highlight
      :target="tabs[current] ?? null"
      axis="x"
      class="bg-subtle inset-y-1 -z-10 rounded-md"
    />
    <Button
      v-for="(item, index) in items"
      :key="item"
      :ref="el => setRef(el, index)"
      variant="ghost"
      tone="neutral"
      size="sm"
      :aria-pressed="current === index"
      @click="current = index"
    >
      {{ item }}
    </Button>
  </Inline>
</template>
