<script setup lang="ts">
  import { Divider, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-sm">
    <Text tone="muted" size="sm">默认是语义分隔线，屏幕阅读器会读出分隔</Text>
    <Divider />
    <Text tone="muted" size="sm">decorative 的线只是装饰，不进无障碍树</Text>
    <Divider decorative />
  </Stack>
</template>
