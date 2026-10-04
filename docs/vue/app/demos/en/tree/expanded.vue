<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Stack, Tree, type TreeValue } from '@hina-ui/vue'
  import { nodes } from './data'

  const expanded = ref<TreeValue[]>(['a'])
  const checked = ref<TreeValue[]>(['a-2-1'])
</script>

<template>
  <Stack class="w-80 max-w-full">
    <Inline>
      <Button size="sm" variant="soft" tone="neutral" @click="expanded = ['a', 'a-2', 'b']">
        Expand all
      </Button>
      <Button size="sm" variant="ghost" tone="neutral" @click="expanded = []">Collapse all</Button>
    </Inline>
    <Tree
      v-model="checked"
      v-model:expanded="expanded"
      multiple
      :items="nodes"
      aria-label="Controlled expansion"
    />
  </Stack>
</template>
