<script setup lang="ts">
  import { Button, Image, Result } from '@hina-ui/vue'
</script>

<template>
  <Result
    title="Today's goal reached"
    description="Seven days in a row of thirty minutes."
    class="w-96"
  >
    <template #icon>
      <Image src="/avatars/hug.webp" :ratio="1" class="size-24 rounded-full" />
    </template>
    <template #actions>
      <Button size="sm">Keep reading</Button>
    </template>
  </Result>
</template>
