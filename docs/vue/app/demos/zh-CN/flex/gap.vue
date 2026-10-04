<script setup lang="ts">
  import { Card, Flex, Stack, Text } from '@hina-ui/vue'
</script>

<template>
  <Flex gap="xl" wrap>
    <Stack gap="xs">
      <Text tone="muted" size="sm">横向的 md 档取 12 像素</Text>
      <Flex gap="md" class="bg-inset rounded-md p-3">
        <Card class="bg-surface size-8" :padded="false" />
        <Card class="bg-surface size-8" :padded="false" />
        <Card class="bg-surface size-8" :padded="false" />
      </Flex>
    </Stack>
    <Stack gap="xs">
      <Text tone="muted" size="sm">纵向的 md 档取 16 像素</Text>
      <Flex direction="col" gap="md" class="bg-inset rounded-md p-3">
        <Card class="bg-surface size-8" :padded="false" />
        <Card class="bg-surface size-8" :padded="false" />
        <Card class="bg-surface size-8" :padded="false" />
      </Flex>
    </Stack>
  </Flex>
</template>
