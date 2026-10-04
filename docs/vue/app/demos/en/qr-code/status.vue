<script setup lang="ts">
  import { onScopeDispose, ref } from 'vue'
  import { QRCode, Select, Stack, Text, type QRCodeStatus } from '@hina-ui/vue'
  const status = ref<QRCodeStatus>('expired')
  const options = [
    { value: 'active', label: 'Active' },
    { value: 'loading', label: 'Loading' },
    { value: 'expired', label: 'Expired' },
    { value: 'scanned', label: 'Scanned' },
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
      aria-label="QR code status"
      class="w-48"
      @update:model-value="change"
    />
    <Text size="sm" tone="muted" class="text-center">
      Refresh simulates a request here. The application controls the status.
    </Text>
  </Stack>
</template>
