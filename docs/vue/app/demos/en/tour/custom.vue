<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, Kbd, Text, Tour, type TourStep } from '@hina-ui/vue'

  const open = ref(false)

  const steps: TourStep[] = [
    {
      target: '#tour-custom-command',
      title: 'Command palette',
      description: 'Open the command palette any time.',
    },
    { target: '#tour-custom-theme', title: 'Theme', description: 'Switch between light and dark.' },
  ]
</script>

<template>
  <Inline gap="sm" align="center" wrap>
    <Button id="tour-custom-command" variant="outline" tone="neutral">Commands</Button>
    <Button id="tour-custom-theme" variant="outline" tone="neutral">Theme</Button>
    <Button variant="ghost" tone="neutral" @click="open = true">Start tour</Button>
  </Inline>
  <Tour v-model:open="open" :steps="steps" locked>
    <template #content="{ step, current }">
      <Text tone="muted" size="sm">{{ step.description }}</Text>
      <Text v-if="current === 1" size="sm" class="mt-2">
        Press
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
        to open it.
      </Text>
    </template>
    <template #footer="{ current, total, next, prev }">
      <Inline gap="sm" align="center" justify="between">
        <Inline gap="xs" aria-hidden="true">
          <span
            v-for="index in total"
            :key="index"
            class="size-1.5 rounded-full"
            :class="index === current ? 'bg-accent' : 'bg-line'"
          />
        </Inline>
        <Inline gap="sm">
          <Button v-if="current > 1" size="sm" variant="ghost" tone="neutral" @click="prev">
            Back
          </Button>
          <Button size="sm" @click="next">{{ current === total ? 'Got it' : 'Continue' }}</Button>
        </Inline>
      </Inline>
    </template>
  </Tour>
</template>
