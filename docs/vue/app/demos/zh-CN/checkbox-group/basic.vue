<script setup lang="ts">
  import { ref } from 'vue'
  import { CheckboxGroup, Stack, Text } from '@hina-ui/vue'

  const channels = ref(['mail'])
  const options = [
    { value: 'mail', label: '邮件' },
    { value: 'push', label: '站内推送' },
    { value: 'sms', label: '短信' },
  ]
</script>

<template>
  <Stack gap="sm">
    <CheckboxGroup v-model="channels" :options="options" aria-label="通知方式" />
    <Text size="sm" tone="muted">当前值：{{ channels }}</Text>
  </Stack>
</template>
