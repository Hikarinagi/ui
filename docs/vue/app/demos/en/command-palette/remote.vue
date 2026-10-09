<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { CommandPalette, Stack, Switch, type CommandItem } from '@hina-ui/vue'

  const books: CommandItem[] = [
    { id: 'spice', label: 'Spice and Wolf', description: 'Isuna Hasekura' },
    { id: 'kino', label: "Kino's Journey", description: 'Keiichi Sigsawa' },
    { id: 'hyouka', label: 'Hyouka', description: 'Honobu Yonezawa' },
    { id: 'book-girl', label: 'Book Girl', description: 'Mizuki Nomura' },
  ]

  const keyword = ref('')
  const offline = ref(false)
  const items = ref<CommandItem[]>([])
  const loading = ref(false)
  const failed = ref(false)

  watch([keyword, offline], ([text, down], _, onCleanup) => {
    const query = text.trim().toLowerCase()
    failed.value = false
    if (!query) {
      items.value = []
      loading.value = false
      return
    }
    loading.value = true
    const timer = setTimeout(() => {
      items.value = down ? [] : books.filter(book => book.label.toLowerCase().includes(query))
      failed.value = down
      loading.value = false
    }, 600)
    onCleanup(() => clearTimeout(timer))
  })
</script>

<template>
  <Stack align="start" class="w-full max-w-sm">
    <Switch v-model="offline">Simulate a service outage</Switch>
    <CommandPalette
      v-model:search="keyword"
      inline
      ignore-filter
      :items="items"
      :loading="loading"
      placeholder="Try wolf or girl"
    >
      <template #loading>Searching</template>
      <template #empty="{ search }">
        {{
          failed
            ? 'The search service is unavailable'
            : search.trim()
              ? `No results for "${search.trim()}"`
              : 'Type a title to search'
        }}
      </template>
    </CommandPalette>
  </Stack>
</template>
