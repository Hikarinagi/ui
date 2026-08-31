<script setup lang="ts">
  import { Button, Popover, Text } from '@hikarinagi/ui'
</script>

<template>
  <Popover>
    <Button variant="outline" tone="neutral">About this book</Button>
    <template #content>
      <Text size="sm">
        Beyond the Stars, published by Hoshimi Studio, follows a girl who restarts an observation
        programme at an abandoned observatory.
      </Text>
    </template>
  </Popover>
</template>
