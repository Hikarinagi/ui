<script setup lang="ts">
  import { Card, Flex, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Flex gap="xl" wrap>
    <Stack gap="xs">
      <Text tone="muted" size="sm">A row takes 12 pixels at md</Text>
      <Flex gap="md" class="bg-inset rounded-md p-3">
        <Card class="bg-surface size-8" :padded="false" />
        <Card class="bg-surface size-8" :padded="false" />
        <Card class="bg-surface size-8" :padded="false" />
      </Flex>
    </Stack>
    <Stack gap="xs">
      <Text tone="muted" size="sm">A column takes 16 pixels at md</Text>
      <Flex direction="col" gap="md" class="bg-inset rounded-md p-3">
        <Card class="bg-surface size-8" :padded="false" />
        <Card class="bg-surface size-8" :padded="false" />
        <Card class="bg-surface size-8" :padded="false" />
      </Flex>
    </Stack>
  </Flex>
</template>
