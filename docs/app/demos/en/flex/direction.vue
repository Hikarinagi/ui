<script setup lang="ts">
  import { Card, Flex, Stack, Text } from '@hina-ui/vue'

  const directions = ['row', 'row-reverse', 'col', 'col-reverse'] as const
</script>

<template>
  <Flex gap="lg" wrap>
    <Stack v-for="direction in directions" :key="direction" gap="xs">
      <Text tone="muted" size="sm">{{ direction }}</Text>
      <Flex :direction="direction" gap="sm" class="bg-inset rounded-md p-3">
        <Card class="bg-surface grid size-8 place-items-center text-sm" :padded="false">1</Card>
        <Card class="bg-surface grid size-8 place-items-center text-sm" :padded="false">2</Card>
        <Card class="bg-surface grid size-8 place-items-center text-sm" :padded="false">3</Card>
      </Flex>
    </Stack>
  </Flex>
</template>
