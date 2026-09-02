<script setup lang="ts">
  import { Button, Dialog, Stack, Text } from '@hina-ui/vue'

  const terms = Array.from(
    { length: 30 },
    (_, i) =>
      `Clause ${i + 1}: using the service means you accept this term, which is here only as placeholder text, long enough that the body actually scrolls.`,
  )
</script>

<template>
  <Dialog title="Terms of service" description="Please read them before you continue.">
    <Button variant="outline" tone="neutral">Read the terms</Button>
    <template #content>
      <Stack gap="sm">
        <Text v-for="line in terms" :key="line">{{ line }}</Text>
      </Stack>
    </template>
    <template #footer="{ close }">
      <Button variant="soft" tone="neutral" @click="close">Decline</Button>
      <Button @click="close">Accept</Button>
    </template>
  </Dialog>
</template>
