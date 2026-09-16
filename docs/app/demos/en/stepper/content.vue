<script setup lang="ts">
  import { Stepper, Button, Card, Inline, Stack, Text } from '@hina-ui/vue'

  const items = [
    { title: 'Step A', description: 'The first description' },
    { title: 'Step B', description: 'A longer description that wraps naturally across lines' },
    { title: 'Step C', description: 'The final description' },
  ]
</script>

<template>
  <Stepper :items="items">
    <template #default="{ item, step, next, prev, canNext, canPrev }">
      <Card>
        <Stack gap="lg">
          <Text weight="medium">{{ item?.title }}</Text>
          <Text tone="muted">Content for step {{ step }} .</Text>
          <Inline justify="between">
            <Button variant="outline" tone="neutral" :disabled="!canPrev" @click="prev">
              Previous
            </Button>
            <Button :disabled="!canNext" @click="next">Next</Button>
          </Inline>
        </Stack>
      </Card>
    </template>
  </Stepper>
</template>
