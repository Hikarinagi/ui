<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Button, CommandPalette, type CommandItems } from '@hina-ui/vue'

  const search = ref('')

  const books = [
    { id: 'b1', label: '星之继承者', tags: ['科幻', '硬科幻'] },
    { id: 'b2', label: '海伯利安', tags: ['科幻', '太空歌剧'] },
    { id: 'b3', label: '基地', tags: ['科幻', '经典'] },
    { id: 'b4', label: '三体', tags: ['科幻', '中文'] },
  ]

  const items = computed<CommandItems>(() => {
    const query = search.value.trim()
    return books
      .filter(book => !query || book.tags.some(tag => tag.includes(query)))
      .map(book => ({ id: book.id, label: book.label, description: book.tags.join('、') }))
  })
</script>

<template>
  <CommandPalette v-model:search="search" :items="items" ignore-filter placeholder="按标签搜索">
    <Button variant="outline" tone="neutral">按标签搜索</Button>
  </CommandPalette>
</template>
