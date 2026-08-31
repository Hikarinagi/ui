<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Spoiler, Stack, Text } from '@hikarinagi/ui'

  const hidden = ref(true)
</script>

<template>
  <Stack class="max-w-lg">
    <Text>
      全书结局：
      <Spoiler v-model:hidden="hidden">两座灯塔在同一夜熄灭</Spoiler>
    </Text>
    <Button variant="outline" tone="neutral" size="sm" @click="hidden = !hidden">
      {{ hidden ? '全部揭示' : '全部遮住' }}
    </Button>
  </Stack>
</template>
