<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Input, Text, Tour, type TourStep } from '@hina-ui/vue'

  const open = ref(false)
  const name = ref('')
  const error = ref('')

  const steps: TourStep[] = [
    {
      target: '#tour-interactive-name',
      title: 'Name your project',
      description: 'Type a name in the field, then press Next.',
      interactive: true,
    },
    {
      target: '#tour-interactive-save',
      title: 'Save',
      description: 'The name shows up in the project list.',
    },
  ]

  async function beforeChange(next: number, previous: number) {
    if (previous !== 1 || next < previous) return true
    await new Promise(resolve => setTimeout(resolve, 600))
    error.value = name.value.trim() ? '' : 'A name is required'
    return !error.value
  }
</script>

<template>
  <Inline gap="sm" align="center" wrap>
    <Input id="tour-interactive-name" v-model="name" placeholder="Project name" class="w-56" />
    <Button id="tour-interactive-save">Save</Button>
    <Button variant="ghost" tone="neutral" @click="open = true">Start tour</Button>
  </Inline>
  <Tour v-model:open="open" :steps="steps" :before-change="beforeChange" @finish="error = ''">
    <template #content="{ step }">
      <Text tone="muted" size="sm">{{ step.description }}</Text>
      <Text v-if="error && step.interactive" tone="danger" size="sm">{{ error }}</Text>
    </template>
  </Tour>
</template>
