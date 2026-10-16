<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Input, Tour, type TourStep } from '@hina-ui/vue'

  const open = ref(false)
  const step = ref(1)

  const steps: TourStep[] = [
    { title: 'Welcome', description: 'Take half a minute to meet the main entry points.' },
    {
      target: '#tour-hero-create',
      title: 'New project',
      description: 'Create your first project here.',
    },
    { target: '#tour-hero-search', title: 'Search', description: 'Find projects by name or tag.' },
    {
      target: '#tour-hero-share',
      title: 'Invite people',
      description: 'Send the link to colleagues and edit together.',
      side: 'left',
    },
  ]

  function start() {
    step.value = 1
    open.value = true
  }
</script>

<template>
  <Inline gap="sm" align="center" wrap>
    <Button id="tour-hero-create">New project</Button>
    <Input id="tour-hero-search" placeholder="Search projects" class="w-48" />
    <Button id="tour-hero-share" variant="outline" tone="neutral">Invite</Button>
    <Button variant="ghost" tone="neutral" @click="start">Start tour</Button>
  </Inline>
  <Tour v-model:open="open" v-model:step="step" :steps="steps" />
</template>
