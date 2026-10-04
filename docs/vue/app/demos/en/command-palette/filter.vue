<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Button, CommandPalette, type CommandItems } from '@hina-ui/vue'

  const search = ref('')

  const books = [
    { id: 'b1', label: 'Inherit the Stars', tags: ['sf', 'hard sf'] },
    { id: 'b2', label: 'Hyperion', tags: ['sf', 'space opera'] },
    { id: 'b3', label: 'Foundation', tags: ['sf', 'classic'] },
    { id: 'b4', label: 'The Three-Body Problem', tags: ['sf', 'chinese'] },
  ]

  const items = computed<CommandItems>(() => {
    const query = search.value.trim().toLowerCase()
    return books
      .filter(book => !query || book.tags.some(tag => tag.includes(query)))
      .map(book => ({ id: book.id, label: book.label, description: book.tags.join(', ') }))
  })
</script>

<template>
  <CommandPalette v-model:search="search" :items="items" ignore-filter placeholder="Search by tag">
    <Button variant="outline" tone="neutral">Search by tag</Button>
  </CommandPalette>
</template>
