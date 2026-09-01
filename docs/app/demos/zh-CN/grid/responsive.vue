<script setup lang="ts">
  import { Card, Grid, Text } from '@hikarinagi/ui'
</script>

<template>
  <div class="w-full max-w-2xl">
    <Text tone="muted" size="sm" class="mb-2 block">窄屏两列，宽屏四列</Text>
    <Grid :cols="2" class="sm:grid-cols-4">
      <Card v-for="i in 8" :key="i" class="bg-emphasis h-12" :padded="false" />
    </Grid>
  </div>
</template>
