<script setup lang="ts">
  import { Card, Inline, Statistic } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="md" align="stretch">
    <Card class="w-56">
      <Statistic label="New reviews" :value="86" :delta="0.18" delta-label="vs last week" />
    </Card>
    <Card class="w-56">
      <Statistic label="Active readers" :value="1204" :delta="-0.05" delta-label="vs last week" />
    </Card>
    <Card class="w-56">
      <Statistic label="Reports" :value="3" :delta="-0.4" delta-label="vs last week" invert />
    </Card>
  </Inline>
</template>
