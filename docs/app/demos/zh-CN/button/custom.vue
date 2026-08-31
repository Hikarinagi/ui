<script setup lang="ts">
  import { Button, Inline } from '@hikarinagi/ui'
</script>

<template>
  <Inline>
    <Button class="rounded-none px-8">直角</Button>
    <Button variant="outline" tone="neutral" class="border-dashed">虚线边框</Button>
    <Button class="bg-purple-600 text-white hover:bg-purple-700">紫色</Button>
  </Inline>
</template>
