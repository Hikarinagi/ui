<script setup lang="ts">
  import { PasswordInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-full max-w-xs">
    <PasswordInput variant="primary" aria-label="primary" model-value="hoshimi" />
    <PasswordInput variant="secondary" aria-label="secondary" model-value="hoshimi" />
    <PasswordInput variant="bare" aria-label="bare" model-value="hoshimi" />
  </Stack>
</template>
