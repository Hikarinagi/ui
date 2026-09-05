<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Card, LoadingOverlay, Stack, Text } from '@hina-ui/vue'

  const loading = ref(false)

  async function reload() {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 1800))
    loading.value = false
  }
</script>

<template>
  <Stack gap="sm" align="start">
    <Card class="relative w-96">
      <Stack gap="xs">
        <Text weight="medium">This week</Text>
        <Text tone="muted" size="sm">128 bookmarks, 32 comments, 12 new followers.</Text>
      </Stack>
      <LoadingOverlay :visible="loading" text="Refreshing" />
    </Card>
    <Button variant="outline" tone="neutral" :disabled="loading" @click="reload">Refresh</Button>
  </Stack>
</template>
