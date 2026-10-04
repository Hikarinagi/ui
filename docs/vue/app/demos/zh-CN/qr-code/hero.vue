<script setup lang="ts">
  import { ref } from 'vue'
  import { FormField, Input, QRCode, Stack, Text } from '@hina-ui/vue'
  const value = ref('https://hinaui.dev')
</script>
<template>
  <Stack align="center" class="w-full max-w-sm" data-demo-qr-hero>
    <QRCode :value="value" label="Hina UI 文档站" />
    <Text size="sm" tone="muted">用手机扫码打开链接</Text>
    <FormField label="二维码内容" class="w-full">
      <Input v-model="value" placeholder="https://hinaui.dev" />
    </FormField>
  </Stack>
</template>
