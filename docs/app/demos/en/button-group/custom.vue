<script setup lang="ts">
  import { Button, ButtonGroup } from '@hikarinagi/ui'
</script>

<template>
  <ButtonGroup
    label="Sort"
    class="[&>*:first-child]:rounded-s-full [&>*:last-child]:rounded-e-full"
  >
    <Button variant="soft" tone="neutral" class="px-6">Newest</Button>
    <Button variant="soft" tone="neutral" class="px-6">Popular</Button>
    <Button variant="soft" tone="neutral" class="px-6">Rating</Button>
  </ButtonGroup>
</template>
