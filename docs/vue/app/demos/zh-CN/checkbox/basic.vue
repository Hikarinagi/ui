<script setup lang="ts">
  import { ref } from 'vue'
  import { Checkbox, Stack, Text } from '@hina-ui/vue'

  const remember = ref(false)
</script>

<template>
  <Stack gap="sm">
    <Checkbox v-model="remember">记住登录状态</Checkbox>
    <Text size="sm" tone="muted">当前值：{{ remember }}</Text>
  </Stack>
</template>
