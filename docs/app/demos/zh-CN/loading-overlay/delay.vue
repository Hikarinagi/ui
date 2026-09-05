<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Card, Inline, LoadingOverlay, Stack, Switch, Text } from '@hina-ui/vue'

  const loading = ref(false)
  const immediate = ref(false)
  const result = ref('')

  async function request(ms: number) {
    loading.value = true
    result.value = ''
    await new Promise(resolve => setTimeout(resolve, ms))
    loading.value = false
    result.value = `${ms} 毫秒后返回`
  }
</script>

<template>
  <Stack gap="md" align="start">
    <Inline gap="md" align="center">
      <Button variant="outline" tone="neutral" :disabled="loading" @click="request(150)">
        快请求
      </Button>
      <Button variant="outline" tone="neutral" :disabled="loading" @click="request(1500)">
        慢请求
      </Button>
      <Switch v-model="immediate">立即显示</Switch>
    </Inline>
    <Card class="relative w-96">
      <Text>
        {{ result || '默认延时下快请求看不到遮罩；打开「立即显示」后两种请求都会看到。' }}
      </Text>
      <LoadingOverlay :visible="loading" :delay="immediate ? 0 : undefined" />
    </Card>
  </Stack>
</template>
