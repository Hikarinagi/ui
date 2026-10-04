<script setup lang="ts">
  import { Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Stack class="max-w-lg" gap="xs">
    <Text tone="default">default 正文</Text>
    <Text tone="muted">muted 次级说明</Text>
    <Text tone="faint">faint 最弱的注记</Text>
    <Text tone="disabled">disabled 不可用</Text>
    <Text tone="accent">accent 强调</Text>
    <Text tone="success">success 成功</Text>
    <Text tone="warning">warning 需要注意</Text>
    <Text tone="danger">danger 错误</Text>
    <Text tone="info">info 补充</Text>
  </Stack>
</template>
