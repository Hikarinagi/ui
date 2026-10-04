<script setup lang="ts">
  import { ref } from 'vue'
  import { PinInput, Stack, Text } from '@hina-ui/vue'

  const code = ref('')
  const submitted = ref('')
</script>

<template>
  <Stack gap="sm" align="start">
    <PinInput v-model="code" :length="4" aria-label="邀请码" @complete="submitted = $event" />
    <Text tone="muted" size="sm">
      {{ submitted ? `已填满：${submitted}` : `当前：${code || '空'}` }}
    </Text>
  </Stack>
</template>
