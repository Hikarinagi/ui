<script setup lang="ts">
  import { onScopeDispose, ref } from 'vue'
  import { Download } from '@lucide/vue'
  import { Button, Inline, QRCode, Stack, Text, type QRCodeExpose } from '@hina-ui/vue'
  const code = ref<QRCodeExpose>()
  const busy = ref(false)
  const error = ref(false)
  const urls = new Set<string>()
  async function save(type: 'image/png' | 'image/svg+xml') {
    if (!code.value || busy.value) return
    busy.value = true
    error.value = false
    try {
      const blob = await code.value.toBlob({ type, scale: 3 })
      const url = URL.createObjectURL(blob)
      urls.add(url)
      const link = document.createElement('a')
      link.href = url
      link.download = type === 'image/png' ? 'hina-ui.png' : 'hina-ui.svg'
      link.click()
      setTimeout(() => {
        URL.revokeObjectURL(url)
        urls.delete(url)
      }, 1000)
    } catch {
      error.value = true
    } finally {
      busy.value = false
    }
  }
  onScopeDispose(() => urls.forEach(url => URL.revokeObjectURL(url)))
</script>
<template>
  <Stack align="center" data-demo-qr-export>
    <QRCode ref="code" value="https://hinaui.dev" logo="/favicon.png" label="Hina UI 文档站" />
    <Inline gap="sm">
      <Button variant="outline" size="sm" :disabled="busy" @click="save('image/png')">
        <template #icon><Download /></template>
        PNG
      </Button>
      <Button variant="outline" size="sm" :disabled="busy" @click="save('image/svg+xml')">
        <template #icon><Download /></template>
        SVG
      </Button>
    </Inline>
    <Text v-if="error" tone="danger" size="sm" role="alert">导出失败，请重试。</Text>
  </Stack>
</template>
