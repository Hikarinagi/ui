<script setup lang="ts">
  import { ref } from 'vue'
  import { Card, Inline, Statistic, Switch } from '@hina-ui/vue'

  const loading = ref(true)
</script>

<template>
  <Inline gap="md" align="center">
    <Card class="w-56">
      <Statistic label="Pages this month" :value="12480" :delta="0.124" :loading="loading" />
    </Card>
    <Switch v-model="loading">Loading</Switch>
  </Inline>
</template>
