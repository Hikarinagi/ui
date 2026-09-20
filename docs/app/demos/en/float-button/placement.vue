<script setup lang="ts">
  import { ref } from 'vue'
  import { Plus } from '@lucide/vue'
  import { Card, Center, FloatButton, FormField, Stack, Switch, Text } from '@hina-ui/vue'

  const rtl = ref(false)
  const result = ref('Start and end follow the writing direction')
  const placements = ['top-start', 'top-end', 'bottom-start', 'bottom-end'] as const
</script>

<template>
  <Stack class="w-full max-w-md">
    <FormField label="Right to left" orientation="horizontal"><Switch v-model="rtl" /></FormField>
    <Card :dir="rtl ? 'rtl' : 'ltr'" class="relative h-64" :padded="false">
      <Center class="h-full px-16">
        <Text role="status" size="sm" tone="muted" class="text-center">{{ result }}</Text>
      </Center>
      <FloatButton
        v-for="placement in placements"
        :key="placement"
        position="absolute"
        :placement="placement"
        :label="placement"
        :offset="16"
        variant="soft"
        size="sm"
        @click="result = placement"
      >
        <Plus />
      </FloatButton>
    </Card>
  </Stack>
</template>
