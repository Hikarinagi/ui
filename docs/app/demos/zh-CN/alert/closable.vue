<script setup lang="ts">
  import { ref } from 'vue'
  import { Alert, Button, Stack } from '@hikarinagi/ui'

  const open = ref(true)
</script>

<template>
  <Stack class="min-h-28 w-full max-w-xl">
    <Alert v-model:open="open" tone="success" closable>文章已发布。</Alert>
    <Button variant="soft" tone="neutral" :disabled="open" class="self-start" @click="open = true">
      再次显示
    </Button>
  </Stack>
</template>
