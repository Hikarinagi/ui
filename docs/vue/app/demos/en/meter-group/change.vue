<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Button, MeterGroup, Stack, type MeterItem } from '@hina-ui/vue'

  const labels = ['Documents', 'Photos', 'Videos', 'Other']
  const sets = [
    [42, 27, 13, 8],
    [12, 36, 31, 6],
    [25, 8, 48, 14],
  ]
  const index = ref(0)

  const items = computed<MeterItem[]>(() =>
    labels.map((label, i) => ({ label, value: sets[index.value]![i]! })),
  )
</script>

<template>
  <Stack gap="md" align="start" class="w-96">
    <MeterGroup label="Storage" :items="items" class="w-full" />
    <Button size="sm" variant="soft" tone="neutral" @click="index = (index + 1) % sets.length">
      Next data set
    </Button>
  </Stack>
</template>
