<script setup lang="ts">
  import { ref } from 'vue'
  import { File, Folder, FolderOpen } from '@lucide/vue'
  import { Inline, Tag, Text, Tree, type TreeValue } from '@hina-ui/vue'
  import { nodes } from './data'

  const checked = ref<TreeValue[]>(['a-2-1'])
</script>

<template>
  <Tree
    v-model="checked"
    multiple
    :items="nodes"
    :default-expanded="['a', 'a-2', 'b']"
    aria-label="Custom nodes"
    class="w-96 max-w-full"
  >
    <template #node="{ node, expanded }">
      <Inline as="span" :wrap="false" gap="sm">
        <FolderOpen
          v-if="node.children?.length && expanded"
          class="text-muted size-4 shrink-0"
          aria-hidden="true"
        />
        <Folder
          v-else-if="node.children?.length"
          class="text-muted size-4 shrink-0"
          aria-hidden="true"
        />
        <File v-else class="text-muted size-4 shrink-0" aria-hidden="true" />
        <Text as="span" size="sm">{{ node.label }}</Text>
      </Inline>
    </template>
    <template #trailing="{ selected, indeterminate }">
      <Tag v-if="indeterminate" size="sm" tone="neutral">Partial</Tag>
      <Tag v-else-if="selected" size="sm">Checked</Tag>
    </template>
  </Tree>
</template>
