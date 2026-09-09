<script setup lang="ts">
  import { Button, Popover, Text } from '@hina-ui/vue'
</script>

<template>
  <Popover>
    <Button variant="outline" tone="neutral">关于这本书</Button>
    <template #content>
      <Text size="sm">ATRI -My Dear Moments- 由 ANIPLEX.EXE 发行，2020 年 6 月 19 日上市。</Text>
    </template>
  </Popover>
</template>
