<script setup lang="ts">
  import { ref } from 'vue'
  import { AlertDialog, Button, Inline } from '@hina-ui/vue'

  const open = ref(false)
</script>

<template>
  <Inline gap="sm">
    <Button variant="outline" tone="neutral" @click="open = true">Open from outside</Button>
    <AlertDialog
      v-model:open="open"
      title="Leave this page?"
      description="Unsaved changes will be lost."
    />
  </Inline>
</template>
