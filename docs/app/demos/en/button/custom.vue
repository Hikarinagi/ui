<script setup lang="ts">
  import { Button, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline>
    <Button class="rounded-none px-8">Square</Button>
    <Button variant="outline" tone="neutral" class="border-dashed">Dashed</Button>
    <Button class="bg-purple-600 text-white hover:bg-purple-700">Purple</Button>
  </Inline>
</template>
