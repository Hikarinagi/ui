<script setup lang="ts">
  import { Card, Container, Stack } from '@hikarinagi/ui'

  const sizes = ['sm', 'md', 'lg', 'xl'] as const
</script>

<template>
  <Stack class="w-full">
    <Stack v-for="size in sizes" :key="size" gap="none" class="bg-inset w-full rounded-md py-3">
      <Container :size="size">
        <Card class="grid h-10 place-items-center text-sm" :padded="false">{{ size }}</Card>
      </Container>
    </Stack>
  </Stack>
</template>
