<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Spoiler, Stack, Text } from '@hina-ui/vue'

  const hidden = ref(true)
</script>

<template>
  <Stack class="max-w-lg">
    <Text>
      全书结局：
      <Spoiler v-model:hidden="hidden">交易在最后一刻反转</Spoiler>
    </Text>
    <Button variant="outline" tone="neutral" size="sm" @click="hidden = !hidden">
      {{ hidden ? '全部揭示' : '全部遮住' }}
    </Button>
  </Stack>
</template>
