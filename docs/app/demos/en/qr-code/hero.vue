<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, Input, QRCode, Stack, Text } from '@hina-ui/vue'
  const value = ref('https://hinaui.dev')
</script>
<template>
  <Stack align="center" class="w-full max-w-sm" data-demo-qr-hero>
    <QRCode :value="value" label="Hina UI documentation" />
    <Text size="sm" tone="muted">Scan with your phone to open the link</Text>
    <FormField label="QR code content" class="w-full">
      <Input v-model="value" placeholder="https://hinaui.dev" />
    </FormField>
  </Stack>
</template>
