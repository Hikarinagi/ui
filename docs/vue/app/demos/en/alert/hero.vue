<script setup lang="ts">
  import { Alert, Button, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="min-h-48 w-full max-w-xl">
    <Alert tone="success" title="Published" closable>The article is now visible to everyone.</Alert>
    <Alert tone="danger" title="Publishing failed">
      The server is not responding for now; your draft has been kept.
      <template #actions>
        <Button size="sm" variant="soft" tone="danger">Retry</Button>
      </template>
    </Alert>
  </Stack>
</template>
