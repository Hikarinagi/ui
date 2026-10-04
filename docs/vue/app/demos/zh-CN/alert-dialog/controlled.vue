<script setup lang="ts">
  import { ref } from 'vue'
  import { AlertDialog, Button, Inline } from '@hina-ui/vue'

  const open = ref(false)
</script>

<template>
  <Inline gap="sm">
    <Button variant="outline" tone="neutral" @click="open = true">从外部打开</Button>
    <AlertDialog v-model:open="open" title="离开当前页面？" description="未保存的修改会丢失。" />
  </Inline>
</template>
