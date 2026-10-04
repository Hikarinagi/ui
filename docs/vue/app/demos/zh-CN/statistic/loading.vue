<script setup lang="ts">
  import { ref } from 'vue'
  import { Card, Inline, Statistic, Switch } from '@hina-ui/vue'

  const loading = ref(true)
</script>

<template>
  <Inline gap="md" align="center">
    <Card class="w-56">
      <Statistic label="本月阅读" :value="12480" suffix="页" :delta="0.124" :loading="loading" />
    </Card>
    <Switch v-model="loading">加载中</Switch>
  </Inline>
</template>
