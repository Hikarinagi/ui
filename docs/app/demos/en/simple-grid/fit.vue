<script setup lang="ts">
  import { Card, SimpleGrid, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="w-full max-w-lg">
    <Stack gap="xs">
      <Text tone="muted" size="sm">
        auto-fill by default: empty tracks stay, each item keeps one cell
      </Text>
      <SimpleGrid min="8rem" gap="sm">
        <Card v-for="i in 2" :key="i" class="bg-inset grid h-12 place-items-center" :padded="false">
          {{ i }}
        </Card>
      </SimpleGrid>
    </Stack>
    <Stack gap="xs">
      <Text tone="muted" size="sm">
        With fit: empty tracks collapse and the two items share the row
      </Text>
      <SimpleGrid min="8rem" gap="sm" fit>
        <Card v-for="i in 2" :key="i" class="bg-inset grid h-12 place-items-center" :padded="false">
          {{ i }}
        </Card>
      </SimpleGrid>
    </Stack>
  </Stack>
</template>
