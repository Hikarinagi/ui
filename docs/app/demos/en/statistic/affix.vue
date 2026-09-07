<script setup lang="ts">
  import { Card, Inline, Statistic } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="md" align="stretch">
    <Card class="w-56">
      <Statistic label="Balance" :value="2480" prefix="$" />
    </Card>
    <Card class="w-56">
      <Statistic label="Average session" :value="42" suffix="min" />
    </Card>
  </Inline>
</template>
