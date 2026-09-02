<script setup lang="ts">
  import { Button, Inline, Space } from '@hina-ui/vue'
</script>

<template>
  <Inline class="bg-inset w-full max-w-md rounded-md p-3">
    <Button size="sm" variant="soft" tone="neutral">左</Button>
    <Space />
    <Button size="sm" variant="soft" tone="neutral">右</Button>
  </Inline>
</template>
