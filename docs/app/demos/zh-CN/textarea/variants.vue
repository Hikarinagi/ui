<script setup lang="ts">
  import { Card, Stack, Textarea } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-md">
    <Textarea aria-label="页面上的输入框" placeholder="直接放在页面上" />
    <Card>
      <Textarea variant="secondary" aria-label="卡片内的输入框" placeholder="放在卡片内" />
    </Card>
  </Stack>
</template>
