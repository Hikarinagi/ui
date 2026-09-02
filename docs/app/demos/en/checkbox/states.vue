<script setup lang="ts">
  import { Checkbox, Stack } from '@hina-ui/vue'
</script>

<template>
  <Stack gap="sm">
    <Checkbox invalid>I have read and accept the terms</Checkbox>
    <Checkbox disabled>Disabled</Checkbox>
    <Checkbox disabled model-value>Disabled and checked</Checkbox>
  </Stack>
</template>
