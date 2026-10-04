<script setup lang="ts">
  import { ref } from 'vue'
  import { Alert, Button, Stack } from '@hina-ui/vue'

  const open = ref(true)
</script>

<template>
  <Stack class="min-h-28 w-full max-w-xl">
    <Alert v-model:open="open" tone="success" closable>The article has been published.</Alert>
    <Button variant="soft" tone="neutral" :disabled="open" class="self-start" @click="open = true">
      Show again
    </Button>
  </Stack>
</template>
