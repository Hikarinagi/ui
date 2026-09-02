<script setup lang="ts">
  import { Callout, Stack } from '@hikarinagi/ui'

  const tones = [
    { tone: 'neutral', text: '不含倾向的补充说明' },
    { tone: 'accent', text: '值得一试的小技巧' },
    { tone: 'info', text: '与当前内容相关的背景信息' },
    { tone: 'success', text: '推荐这样做' },
    { tone: 'warning', text: '这样做之前需要留意' },
    { tone: 'danger', text: '这样做会造成不可恢复的后果' },
  ] as const
</script>

<template>
  <Stack class="w-full max-w-md">
    <Callout v-for="item in tones" :key="item.tone" :tone="item.tone">{{ item.text }}</Callout>
  </Stack>
</template>
