<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Button, CommandPalette, type CommandItem, type CommandItems } from '@hina-ui/vue'

  const search = ref('')

  const recent = ['狼与香辛料', '时雨泽惠一']
  const hot = ['冰菓', '文学少女']

  const books: CommandItem[] = [
    { id: 'spice', label: '狼与香辛料', description: '支仓冻砂' },
    { id: 'kino', label: '奇诺之旅', description: '时雨泽惠一' },
    { id: 'hyouka', label: '冰菓', description: '米泽穗信' },
    { id: 'book-girl', label: '文学少女', description: '野村美月' },
  ]

  function suggest(text: string): CommandItem {
    return { id: text, label: text, closeOnSelect: false, onSelect: () => (search.value = text) }
  }

  const items = computed<CommandItems>(() =>
    search.value.trim()
      ? books
      : [
          { label: '最近搜索', items: recent.map(suggest) },
          { label: '热门搜索', items: hot.map(suggest) },
        ],
  )
</script>

<template>
  <CommandPalette v-model:search="search" :items="items" placeholder="搜索书名或作者">
    <Button variant="outline" tone="neutral">搜索书籍</Button>
  </CommandPalette>
</template>
