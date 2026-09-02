<script setup lang="ts">
  import { ref } from 'vue'
  import { CheckboxGroup, Stack, Text } from '@hina-ui/vue'

  const channels = ref(['mail'])
  const options = [
    { value: 'mail', label: 'Email' },
    { value: 'push', label: 'Push notification' },
    { value: 'sms', label: 'SMS' },
  ]
</script>

<template>
  <Stack gap="sm">
    <CheckboxGroup v-model="channels" :options="options" aria-label="Notification channels" />
    <Text size="sm" tone="muted">Value: {{ channels }}</Text>
  </Stack>
</template>
