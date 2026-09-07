<script setup lang="ts">
  import { Button, Result } from '@hina-ui/vue'
</script>

<template>
  <Result
    status="error"
    title="Payment not completed"
    description="The bank did not confirm the transaction; nothing was charged."
    class="w-96"
  >
    <template #actions>
      <Button size="sm">Pay again</Button>
      <Button size="sm" variant="ghost" tone="neutral">Contact support</Button>
    </template>
  </Result>
</template>
