<script setup lang="ts">
  import { ref } from 'vue'
  import { RefreshCw } from '@lucide/vue'
  import { Center, FloatButton, FormField, Stack, Switch, Text } from '@hina-ui/vue'

  const visible = ref(true)
  const loading = ref(false)
  const disabled = ref(false)
  const result = ref('Visibility changes include a transition')
</script>

<template>
  <Stack class="w-full max-w-xs">
    <FormField label="Show button" orientation="horizontal"><Switch v-model="visible" /></FormField>
    <FormField label="Loading" orientation="horizontal"><Switch v-model="loading" /></FormField>
    <FormField label="Disabled" orientation="horizontal"><Switch v-model="disabled" /></FormField>
    <Center class="h-24">
      <FloatButton
        position="static"
        label="Sync profile"
        :visible="visible"
        :loading="loading"
        :disabled="disabled"
        @click="result = 'Action: Sync profile'"
      >
        <RefreshCw />
      </FloatButton>
    </Center>
    <Text role="status" size="sm" tone="muted" class="text-center">{{ result }}</Text>
  </Stack>
</template>
