<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Stack, Text, Tree, type TreeValue } from '@hina-ui/vue'
  import { nodes } from './data'

  const checked = ref<TreeValue[]>(['a-2-1'])
</script>

<template>
  <Stack class="w-96 max-w-full">
    <Tree
      v-model="checked"
      multiple
      :items="nodes"
      :default-expanded="['a', 'a-2', 'b']"
      aria-label="父子联动勾选"
    />
    <Inline>
      <Button
        size="sm"
        variant="soft"
        tone="neutral"
        @click="checked = nodes.map(node => node.value)"
      >
        全选
      </Button>
      <Button size="sm" variant="ghost" tone="neutral" @click="checked = []">清空</Button>
    </Inline>
    <Text size="sm" tone="muted" class="break-all">绑定值：{{ checked.join(', ') || '—' }}</Text>
  </Stack>
</template>
