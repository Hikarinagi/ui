<script setup lang="ts">
  import { ref } from 'vue'
  import { Tree, type TreeValue } from '@hina-ui/vue'
  import { nodes } from './data'

  const checked = ref<TreeValue[]>(['a-2-1'])
</script>

<template>
  <Tree
    v-model="checked"
    multiple
    :items="nodes"
    :default-expanded="['a', 'a-2', 'b']"
    aria-label="树形勾选"
    class="w-80 max-w-full"
  />
</template>
