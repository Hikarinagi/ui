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
        <Text weight="medium">本周新增</Text>
        <Text tone="muted" size="sm">收藏 128 次，评论 32 条，新粉丝 12 位。</Text>
      </Stack>
      <LoadingOverlay :visible="loading" text="正在刷新" />
    </Card>
    <Button variant="outline" tone="neutral" :disabled="loading" @click="reload">刷新</Button>
  </Stack>
</template>
