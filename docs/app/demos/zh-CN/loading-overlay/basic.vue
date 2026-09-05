<script setup lang="ts">
  import { ref } from 'vue'
  import { Card, LoadingOverlay, Stack, Switch, Text } from '@hina-ui/vue'

  const loading = ref(true)
</script>

<template>
  <Stack gap="md" align="start">
    <Switch v-model="loading">显示遮罩</Switch>
    <Card class="relative w-96">
      <Text>这块内容在加载期间被压淡，也不能点击。</Text>
      <LoadingOverlay :visible="loading" />
    </Card>
  </Stack>
</template>
