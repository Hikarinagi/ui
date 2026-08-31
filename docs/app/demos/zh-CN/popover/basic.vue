<script setup lang="ts">
  import { Button, Popover, Text } from '@hikarinagi/ui'
</script>

<template>
  <Popover>
    <Button variant="outline" tone="neutral">关于这本书</Button>
    <template #content>
      <Text size="sm">
        《星之彼方》由星见工作室发行，讲述一名少女在废弃天文台重启观测计划的故事。
      </Text>
    </template>
  </Popover>
</template>
