<script setup lang="ts">
  import { CommandPalette, Mark, Text, type CommandItems } from '@hina-ui/vue'

  interface Book {
    id: string
    title: string
    author: string
    volumes: number
  }

  const books: Book[] = [
    { id: 'spice', title: 'Spice and Wolf', author: 'Isuna Hasekura', volumes: 17 },
    { id: 'kino', title: "Kino's Journey", author: 'Keiichi Sigsawa', volumes: 23 },
    { id: 'hyouka', title: 'Hyouka', author: 'Honobu Yonezawa', volumes: 6 },
    { id: 'book-girl', title: 'Book Girl', author: 'Mizuki Nomura', volumes: 8 },
  ]

  const items: CommandItems<Book> = books.map(book => ({
    id: book.id,
    label: book.title,
    keywords: [book.author],
    data: book,
  }))
</script>

<template>
  <CommandPalette inline :items="items" placeholder="Search by title or author" class="max-w-sm">
    <template #item="{ item, match }">
      <Text as="span" size="sm" truncate class="min-w-0 flex-1">
        <template v-if="match">
          <Text as="span" size="inherit">{{ item.label.slice(0, match.start) }}</Text>
          <Mark>{{ item.label.slice(match.start, match.end) }}</Mark>
          <Text as="span" size="inherit">{{ item.label.slice(match.end) }}</Text>
        </template>
        <template v-else>{{ item.label }}</template>
      </Text>
      <Text as="span" size="xs" tone="muted" class="shrink-0">
        {{ item.data?.author }} · {{ item.data?.volumes }} volumes
      </Text>
    </template>
  </CommandPalette>
</template>
