<script setup lang="ts">
  import { ref } from 'vue'
  import { PinInput, Stack, Text } from '@hina-ui/vue'

  const code = ref('')
  const submitted = ref('')
</script>

<template>
  <Stack gap="sm" align="start">
    <PinInput v-model="code" :length="4" aria-label="Invite code" @complete="submitted = $event" />
    <Text tone="muted" size="sm">
      {{ submitted ? `Completed: ${submitted}` : `Current: ${code || 'empty'}` }}
    </Text>
  </Stack>
</template>
