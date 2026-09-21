<script setup lang="ts">
  import { computed, onBeforeUnmount, ref } from 'vue'
  import { Button, Card, Masonry, Stack, Text, Flex } from '@hina-ui/vue'
  import { masonryNotes } from '../../masonry'
  const notes = masonryNotes('zh-CN')
  const count = ref(6)
  const loading = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined
  const items = computed(() =>
    Array.from({ length: count.value }, (_, id) => ({ ...notes[id % notes.length]!, id })),
  )
  function load() {
    if (loading.value) return
    loading.value = true
    timer = setTimeout(() => {
      count.value += 6
      loading.value = false
    }, 650)
  }
  onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <Stack class="w-full max-w-2xl">
    <Flex wrap align="center" gap="sm">
      <Button size="sm" :loading="loading" :disabled="count >= 24" @click="load">追加 6 条</Button>
      <Button size="sm" variant="outline" :disabled="loading || count === 0" @click="count = 0">
        清空
      </Button>
      <Text size="sm" tone="muted">{{ count }} 条笔记</Text>
    </Flex>
    <Masonry
      :items="items"
      :get-key="item => item.id"
      :min-column-width="180"
      :loading="loading"
      label="笔记列表"
    >
      <template #default="{ item }">
        <Card>
          <Stack gap="sm">
            <Text size="sm" weight="medium">{{ item.title }}</Text>
            <Text size="sm" tone="muted">{{ item.body }}</Text>
          </Stack>
        </Card>
      </template>
      <template #empty>
        <Stack align="center" gap="sm">
          <Text weight="medium">还没有笔记</Text>
          <Text size="sm" tone="muted">点击“追加 6 条”重新加载。</Text>
        </Stack>
      </template>
    </Masonry>
  </Stack>
</template>
