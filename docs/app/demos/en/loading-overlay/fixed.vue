<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Image, LoadingOverlay, Stack, Text } from '@hina-ui/vue'

  const loading = ref(false)

  async function reload() {
    loading.value = true
    await new Promise(resolve => setTimeout(resolve, 2000))
    loading.value = false
  }
</script>

<template>
  <Button variant="outline" tone="neutral" @click="reload">Cover the page for two seconds</Button>
  <LoadingOverlay :visible="loading" fixed>
    <Stack gap="xs" align="center" role="status">
      <Image
        src="/mascot/run.gif"
        alt="Hoshimi Shion running over with a book"
        :ratio="1"
        fit="contain"
        :skeleton="false"
        eager
        :lazy="false"
        class="size-32"
      />
      <Text size="sm" tone="muted">Switching account</Text>
    </Stack>
  </LoadingOverlay>
</template>
