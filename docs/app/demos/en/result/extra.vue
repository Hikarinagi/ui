<script setup lang="ts">
  import { Button, Code, Result, Text } from '@hina-ui/vue'
</script>

<template>
  <Result
    status="success"
    title="Order placed"
    description="We will notify you when it ships."
    class="w-96"
  >
    <Text size="sm" tone="muted">
      Order
      <Code>HN-20260907-0412</Code>
    </Text>
    <template #actions>
      <Button size="sm" variant="soft" tone="neutral">View order</Button>
    </template>
  </Result>
</template>
