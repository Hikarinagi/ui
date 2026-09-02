<script setup lang="ts">
  import { Card, SimpleGrid, Stack, Text } from '@hikarinagi/ui'
</script>

<template>
  <Stack class="w-full max-w-lg">
    <Stack gap="xs">
      <Text tone="muted" size="sm">默认 auto-fill：空轨道保留，两个子项各占一格</Text>
      <SimpleGrid min="8rem" gap="sm">
        <Card v-for="i in 2" :key="i" class="bg-inset grid h-12 place-items-center" :padded="false">
          {{ i }}
        </Card>
      </SimpleGrid>
    </Stack>
    <Stack gap="xs">
      <Text tone="muted" size="sm">fit 为真：空轨道塌陷，两个子项分掉整行</Text>
      <SimpleGrid min="8rem" gap="sm" fit>
        <Card v-for="i in 2" :key="i" class="bg-inset grid h-12 place-items-center" :padded="false">
          {{ i }}
        </Card>
      </SimpleGrid>
    </Stack>
  </Stack>
</template>
