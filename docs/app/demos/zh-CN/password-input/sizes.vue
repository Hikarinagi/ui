<script setup lang="ts">
  import { PasswordInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-64">
    <PasswordInput size="sm" model-value="hoshimi" aria-label="小号" />
    <PasswordInput size="md" model-value="hoshimi" aria-label="中号" />
    <PasswordInput size="lg" model-value="hoshimi" aria-label="大号" />
  </Stack>
</template>
