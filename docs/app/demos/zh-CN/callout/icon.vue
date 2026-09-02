<script setup lang="ts">
  import { BookOpen } from '@lucide/vue'
  import { Callout, Stack } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="w-full max-w-md">
    <Callout :icon="false">隐藏图标后，正文占满标注的整个宽度。</Callout>
    <Callout tone="info">
      <template #icon>
        <BookOpen class="text-info-text mt-0.5 size-5 shrink-0" />
      </template>
      替换为与内容相关的图标。
    </Callout>
  </Stack>
</template>
