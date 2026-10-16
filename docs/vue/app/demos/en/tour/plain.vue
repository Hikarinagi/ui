<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Tour, type TourStep } from '@hina-ui/vue'

  const open = ref(false)

  const steps: TourStep[] = [
    {
      target: '#tour-plain-filter',
      title: 'Filter',
      description: 'The page stays usable during the tour.',
    },
    {
      target: '#tour-plain-sort',
      title: 'Sort',
      description: 'Click to switch between ascending and descending.',
    },
  ]
</script>

<template>
  <Inline gap="sm" align="center" wrap>
    <Button id="tour-plain-filter" variant="outline" tone="neutral">Filter</Button>
    <Button id="tour-plain-sort" variant="outline" tone="neutral">Sort</Button>
    <Button variant="ghost" tone="neutral" @click="open = true">Start tour</Button>
  </Inline>
  <Tour v-model:open="open" :steps="steps" :mask="false" />
</template>
