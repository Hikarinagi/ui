<script setup lang="ts">
  import { ref } from 'vue'
  import { AlertDialog, Button, Stack, Text } from '@hina-ui/vue'

  const published = ref(false)
</script>

<template>
  <Stack gap="sm" align="start">
    <AlertDialog
      title="Publish this article?"
      description="Once published, everyone can see it."
      confirm-text="Publish"
      cancel-text="Not yet"
      @confirm="published = true"
    >
      <Button variant="outline" tone="neutral">Publish</Button>
    </AlertDialog>
    <Text v-if="published" tone="muted" size="sm">The article was published.</Text>
  </Stack>
</template>
