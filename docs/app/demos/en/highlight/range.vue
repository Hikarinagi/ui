<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Highlight, Inline, Stack, Text } from '@hina-ui/vue'

  const rows = ['Overview', 'Characters', 'Staff', 'Release']
  const from = ref(1)
  const to = ref(2)
  const items = ref<HTMLElement[]>([])

  function setRef(instance: unknown, index: number) {
    const el =
      instance && typeof instance === 'object' && '$el' in instance
        ? (instance as { $el: unknown }).$el
        : instance
    if (el instanceof HTMLElement) items.value[index] = el
  }
</script>

<template>
  <Stack gap="md" class="w-full max-w-sm">
    <Inline gap="sm">
      <Button size="sm" variant="outline" tone="neutral" @click="from = (from + 1) % rows.length">
        Move start
      </Button>
      <Button size="sm" variant="outline" tone="neutral" @click="to = (to + 1) % rows.length">
        Move end
      </Button>
    </Inline>

    <Stack gap="none" class="border-line relative isolate rounded-lg border p-1">
      <Highlight
        :target="items[Math.min(from, to)] ?? null"
        :until="items[Math.max(from, to)] ?? null"
        axis="y"
        class="bg-accent-soft inset-x-1 -z-10 rounded-md"
      />
      <Text
        v-for="(row, index) in rows"
        :key="row"
        :ref="el => setRef(el, index)"
        as="span"
        size="sm"
        class="block px-3 py-1.5"
      >
        {{ row }}
      </Text>
    </Stack>
  </Stack>
</template>
