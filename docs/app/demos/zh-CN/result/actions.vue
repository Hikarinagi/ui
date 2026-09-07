<script setup lang="ts">
  import { Button, Result } from '@hina-ui/vue'
</script>

<template>
  <Result
    status="error"
    title="支付未完成"
    description="银行没有确认这笔交易，款项不会被扣除。"
    class="w-96"
  >
    <template #actions>
      <Button size="sm">重新支付</Button>
      <Button size="sm" variant="ghost" tone="neutral">联系客服</Button>
    </template>
  </Result>
</template>
