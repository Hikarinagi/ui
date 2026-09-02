<script setup lang="ts">
  import { ref } from 'vue'
  import { RotateCw, Trash2 } from '@lucide/vue'
  import { IconButton, Inline } from '@hina-ui/vue'

  const refreshing = ref(false)

  function refresh() {
    refreshing.value = true
    setTimeout(() => (refreshing.value = false), 2000)
  }
</script>

<template>
  <Inline>
    <IconButton label="刷新" variant="outline" :loading="refreshing" @click="refresh">
      <RotateCw />
    </IconButton>
    <IconButton label="删除" variant="outline" tone="danger" disabled>
      <Trash2 />
    </IconButton>
  </Inline>
</template>
