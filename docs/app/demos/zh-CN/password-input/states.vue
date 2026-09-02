<script setup lang="ts">
  import { PasswordInput, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack class="w-64">
    <PasswordInput invalid model-value="123456" aria-label="校验未通过" />
    <PasswordInput disabled model-value="hoshimi" aria-label="已禁用" />
  </Stack>
</template>
