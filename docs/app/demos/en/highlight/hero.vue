<script setup lang="ts">
  import { ref, useId } from 'vue'
  import { Button, Highlight, Inline } from '@hina-ui/vue'

  const items = ['All', 'Galgame', 'Light novel', 'Manga']
  const current = ref(0)
  const id = useId()
</script>

<template>
  <Inline gap="none" class="bg-inset relative isolate rounded-md p-1">
    <Button
      v-for="(item, index) in items"
      :key="item"
      variant="ghost"
      tone="neutral"
      size="sm"
      :aria-current="current === index ? 'true' : undefined"
      :class="current === index ? 'z-0' : 'z-[1]'"
      @click="current = index"
    >
      <Highlight
        v-if="current === index"
        :id="id"
        axis="x"
        class="bg-surface absolute inset-0 -z-10 rounded-md shadow-sm"
      />
      {{ item }}
    </Button>
  </Inline>
</template>
