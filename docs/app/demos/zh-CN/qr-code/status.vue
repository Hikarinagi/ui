<script setup lang="ts">
  import { onScopeDispose, ref } from 'vue'
  import { QRCode, Select, Stack, Text, type QRCodeStatus } from '@hina-ui/vue'
  const status = ref<QRCodeStatus>('expired')
  const options = [
    { value: 'active', label: '可扫描' },
    { value: 'loading', label: '加载中' },
    { value: 'expired', label: '已过期' },
    { value: 'scanned', label: '已扫描' },
  ]
  let timer: ReturnType<typeof setTimeout> | undefined
  function refresh() {
    clearTimeout(timer)
    status.value = 'loading'
    timer = setTimeout(() => {
      status.value = 'active'
    }, 800)
  }
  function change(value: unknown) {
    clearTimeout(timer)
    status.value = value as QRCodeStatus
  }
  onScopeDispose(() => clearTimeout(timer))
</script>
<template>
  <Stack align="center" class="w-full max-w-sm" data-demo-qr-status>
    <QRCode value="https://hinaui.dev" :status="status" @refresh="refresh" />
    <Select
      :model-value="status"
      :options="options"
      aria-label="二维码状态"
      class="w-48"
      @update:model-value="change"
    />
    <Text size="sm" tone="muted" class="text-center">
      刷新在这里模拟一次异步请求，状态由调用方控制。
    </Text>
  </Stack>
</template>
