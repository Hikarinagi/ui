<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Button, CommandPalette, type CommandItem, type CommandItems } from '@hina-ui/vue'

  const search = ref('')

  const recent = ref(['Spice and Wolf', 'Keiichi Sigsawa'])
  const hot = ['Hyouka', 'Book Girl']

  const books: CommandItem[] = [
    { id: 'spice', label: 'Spice and Wolf', description: 'Isuna Hasekura' },
    { id: 'kino', label: "Kino's Journey", description: 'Keiichi Sigsawa' },
    { id: 'hyouka', label: 'Hyouka', description: 'Honobu Yonezawa' },
    { id: 'book-girl', label: 'Book Girl', description: 'Mizuki Nomura' },
  ]

  function suggest(text: string): CommandItem {
    return { id: text, label: text, closeOnSelect: false, onSelect: () => (search.value = text) }
  }

  const items = computed<CommandItems>(() =>
    search.value.trim()
      ? books
      : [
          ...(recent.value.length
            ? [{ label: 'Recent searches', items: recent.value.map(suggest) }]
            : []),
          { label: 'Popular searches', items: hot.map(suggest) },
        ],
  )
</script>

<template>
  <CommandPalette v-model:search="search" :items="items" placeholder="Search by title or author">
    <Button variant="outline" tone="neutral">Search books</Button>
    <template #heading="{ group }">
      {{ group.label }}
      <Button
        v-if="group.label === 'Recent searches'"
        size="xs"
        variant="ghost"
        tone="neutral"
        @click="recent = []"
      >
        Clear
      </Button>
    </template>
  </CommandPalette>
</template>
