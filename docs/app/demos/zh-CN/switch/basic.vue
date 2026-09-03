<script setup lang="ts">
  import { ref } from 'vue'
  import { Switch, Stack, Text } from '@hina-ui/vue'

  const nsfw = ref(false)
</script>

<template>
  <Stack gap="sm">
    <Switch v-model="nsfw">显示限制级内容</Switch>
    <Text size="sm" tone="muted">当前值：{{ nsfw }}</Text>
  </Stack>
</template>
