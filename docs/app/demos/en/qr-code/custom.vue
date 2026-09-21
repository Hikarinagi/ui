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
        <Text weight="medium">Share link expired</Text>
        <Text size="xs" tone="muted">Generate a fresh code to continue</Text>
        <Button size="sm" variant="outline" @click="refresh">Generate again</Button>
      </template>
    </QRCode>
    <Button variant="ghost" size="sm" :disabled="expired" @click="expired = true">
      Simulate expiry
    </Button>
  </Stack>
</template>
