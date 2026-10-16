<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Tour, type TourStep } from '@hina-ui/vue'

  const open = ref(false)

  const steps: TourStep[] = [
    { target: '#tour-beacon-export', title: 'Export', description: 'You can now export to PDF.' },
    {
      target: '#tour-beacon-history',
      title: 'History',
      description: 'Every save keeps a version.',
    },
  ]
</script>

<template>
  <Inline gap="lg" align="center" wrap>
    <Button id="tour-beacon-export" variant="outline" tone="neutral">Export</Button>
    <Button id="tour-beacon-history" variant="outline" tone="neutral">History</Button>
    <Button variant="ghost" tone="neutral" @click="open = !open">
      {{ open ? 'Hide hints' : 'Show what is new' }}
    </Button>
  </Inline>
  <Tour v-model:open="open" :steps="steps" beacon />
</template>
