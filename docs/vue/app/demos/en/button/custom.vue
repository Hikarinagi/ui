<script setup lang="ts">
  import { Button, Inline } from '@hina-ui/vue'
</script>

<template>
  <Inline>
    <Button class="rounded-none px-8">Square</Button>
    <Button variant="outline" tone="neutral" class="border-dashed">Dashed</Button>
    <Button class="bg-purple-600 text-white hover:bg-purple-700">Purple</Button>
  </Inline>
</template>
