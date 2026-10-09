<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { CommandPalette, Stack, Switch, type CommandItem } from '@hina-ui/vue'

  const books: CommandItem[] = [
    { id: 'spice', label: '狼与香辛料', description: '支仓冻砂' },
    { id: 'kino', label: '奇诺之旅', description: '时雨泽惠一' },
    { id: 'hyouka', label: '冰菓', description: '米泽穗信' },
    { id: 'book-girl', label: '文学少女', description: '野村美月' },
  ]

  const keyword = ref('')
  const offline = ref(false)
  const items = ref<CommandItem[]>([])
  const loading = ref(false)
  const failed = ref(false)

  watch([keyword, offline], ([text, down], _, onCleanup) => {
    const query = text.trim()
    failed.value = false
    if (!query) {
      items.value = []
      loading.value = false
      return
    }
    loading.value = true
    const timer = setTimeout(() => {
      items.value = down ? [] : books.filter(book => book.label.includes(query))
      failed.value = down
      loading.value = false
    }, 600)
    onCleanup(() => clearTimeout(timer))
  })
</script>

<template>
  <Stack align="start" class="w-full max-w-sm">
    <Switch v-model="offline">模拟服务不可用</Switch>
    <CommandPalette
      v-model:search="keyword"
      inline
      ignore-filter
      :items="items"
      :loading="loading"
      placeholder="试试「狼」或「少女」"
    >
      <template #loading>正在搜索</template>
      <template #empty="{ search }">
        {{
          failed
            ? '搜索服务暂时不可用'
            : search.trim()
              ? `没有找到「${search.trim()}」`
              : '输入书名搜索'
        }}
      </template>
    </CommandPalette>
  </Stack>
</template>
