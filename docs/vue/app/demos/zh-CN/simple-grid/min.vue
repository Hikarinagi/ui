<script setup lang="ts">
  import { Card, SimpleGrid, Stack, Text } from '@hina-ui/vue'

  const mins = ['6rem', '10rem', '16rem'] as const
</script>

<template>
  <Stack class="w-full max-w-lg">
    <Stack v-for="min in mins" :key="min" gap="xs">
      <Text tone="muted" size="sm">min {{ min }}</Text>
      <SimpleGrid :min="min" gap="sm">
        <Card v-for="i in 4" :key="i" class="bg-inset h-10" :padded="false" />
      </SimpleGrid>
    </Stack>
  </Stack>
</template>
