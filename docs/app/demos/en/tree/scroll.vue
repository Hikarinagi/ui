<script setup lang="ts">
  import { ref } from 'vue'
  import { ScrollArea, Tree, type TreeNode, type TreeValue } from '@hina-ui/vue'

  const checked = ref<TreeValue[]>([])
  const items: TreeNode[] = [
    {
      value: 'root',
      label: 'Group',
      children: Array.from({ length: 40 }, (_, index) => ({
        value: index,
        label: `Node ${index + 1}`,
      })),
    },
  ]
</script>

<template>
  <ScrollArea class="h-64 w-80 max-w-full">
    <Tree
      v-model="checked"
      multiple
      :items="items"
      :default-expanded="['root']"
      aria-label="Scrollable tree"
    />
  </ScrollArea>
</template>
