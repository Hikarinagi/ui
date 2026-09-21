<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, QRCode, Stack, Text } from '@hina-ui/vue'
  const expired = ref(true)
</script>
<template>
  <Stack align="center" data-demo-qr-custom>
    <QRCode
      value="https://hinaui.dev"
      :status="expired ? 'expired' : 'active'"
      :size="224"
      @refresh="expired = false"
    >
      <template #status="{ refresh }">
        <Text weight="medium">分享链接已过期</Text>
        <Text size="xs" tone="muted">重新生成后再扫码打开</Text>
        <Button size="sm" variant="outline" @click="refresh">重新生成</Button>
      </template>
    </QRCode>
    <Button variant="ghost" size="sm" :disabled="expired" @click="expired = true">模拟过期</Button>
  </Stack>
</template>
