<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Progress, Stack } from '@hina-ui/vue'

  const value = ref(30)
  const step = (delta: number) => {
    value.value = Math.min(100, Math.max(0, value.value + delta))
  }
</script>

<template>
  <Stack gap="md" class="w-80">
    <Progress :value="value" label="Downloading" show-value />
    <Inline gap="sm">
      <Button size="sm" variant="soft" tone="neutral" :disabled="value === 0" @click="step(-10)">
        −10
      </Button>
      <Button size="sm" variant="soft" tone="neutral" :disabled="value === 100" @click="step(10)">
        +10
      </Button>
    </Inline>
  </Stack>
</template>
