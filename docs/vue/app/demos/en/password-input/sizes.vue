<script setup lang="ts">
  import { PasswordInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-64">
    <PasswordInput size="sm" model-value="hoshimi" aria-label="Small" />
    <PasswordInput size="md" model-value="hoshimi" aria-label="Medium" />
    <PasswordInput size="lg" model-value="hoshimi" aria-label="Large" />
  </Stack>
</template>
