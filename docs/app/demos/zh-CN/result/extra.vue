<script setup lang="ts">
  import { Button, Code, Result, Text } from '@hina-ui/vue'
</script>

<template>
  <Result status="success" title="订单已提交" description="我们会在发货后通知你。" class="w-96">
    <Text size="sm" tone="muted">
      订单号
      <Code>HN-20260907-0412</Code>
    </Text>
    <template #actions>
      <Button size="sm" variant="soft" tone="neutral">查看订单</Button>
    </template>
  </Result>
</template>
