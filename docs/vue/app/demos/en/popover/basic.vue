<script setup lang="ts">
  import { Button, Popover, Text } from '@hina-ui/vue'
</script>

<template>
  <Popover>
    <Button variant="outline" tone="neutral">About this book</Button>
    <template #content>
      <Text size="sm">
        ATRI, published by ANIPLEX.EXE, follows a girl who restarts an observation programme at an
        abandoned observatory.
      </Text>
    </template>
  </Popover>
</template>
