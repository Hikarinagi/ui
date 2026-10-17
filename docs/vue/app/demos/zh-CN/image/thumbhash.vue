<script setup lang="ts">
  import { shallowRef } from 'vue'
  import { Button, Image, Stack } from '@hina-ui/vue'

  const round = shallowRef(0)
</script>

<template>
  <Stack align="start" class="w-full max-w-md">
    <Image
      :key="round"
      :src="`/sample.webp?round=${round}`"
      thumbhash="YMcJJIIhukWZenmwmHWb9Pc5nw=="
      alt="夏日午后的坡道"
      :ratio="16 / 9"
      class="rounded-md"
    />
    <Button size="sm" variant="soft" tone="neutral" @click="round++">重新加载</Button>
  </Stack>
</template>
