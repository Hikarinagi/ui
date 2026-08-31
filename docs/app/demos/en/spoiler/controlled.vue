<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Spoiler, Stack, Text } from '@hikarinagi/ui'

  const hidden = ref(true)
</script>

<template>
  <Stack class="max-w-lg">
    <Text>
      How it ends:
      <Spoiler v-model:hidden="hidden">both lighthouses go dark the same night</Spoiler>
    </Text>
    <Button variant="outline" tone="neutral" size="sm" @click="hidden = !hidden">
      {{ hidden ? 'Reveal all' : 'Hide all' }}
    </Button>
  </Stack>
</template>
