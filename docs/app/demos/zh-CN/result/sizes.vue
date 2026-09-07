<script setup lang="ts">
  import { Result, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="lg" class="w-96">
    <Result status="success" size="sm" title="已保存" description="改动已经生效。" />
    <Result status="success" title="已保存" description="改动已经生效。" />
    <Result status="success" size="lg" title="已保存" description="改动已经生效。" />
  </Stack>
</template>
