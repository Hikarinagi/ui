<script setup lang="ts">
  import { ref } from 'vue'
  import {
    FormField,
    Inline,
    QRCode,
    SegmentedControl,
    Slider,
    Stack,
    Switch,
    Text,
    type QRCodeLevel,
  } from '@hina-ui/vue'
  const size = ref(192)
  const logo = ref(true)
  const brand = ref(false)
  const level = ref<QRCodeLevel>('H')
  const levels = ['L', 'M', 'Q', 'H'].map(value => ({ value, label: value }))
</script>
<template>
  <Stack align="center" class="w-full max-w-sm" data-demo-qr-appearance>
    <QRCode
      value="https://hinaui.dev"
      :size="size"
      :level="level"
      :logo="logo ? '/favicon.png' : undefined"
      :color="brand ? 'var(--color-brand-800)' : undefined"
    />
    <Stack class="w-full">
      <FormField label="Size">
        <Inline :wrap="false" gap="sm">
          <Slider v-model="size" :min="128" :max="256" :step="8" class="flex-1" />
          <Text size="sm" tone="muted" class="w-14 shrink-0 tabular-nums">{{ size }}px</Text>
        </Inline>
      </FormField>
      <FormField label="Error correction">
        <SegmentedControl v-model="level" :options="levels" block />
      </FormField>
      <Inline justify="between">
        <Switch v-model="logo">Center logo</Switch>
        <Switch v-model="brand">Brand color</Switch>
      </Inline>
    </Stack>
  </Stack>
</template>
