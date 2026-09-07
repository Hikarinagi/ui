<script setup lang="ts">
  import { Card, Inline, Statistic } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="md" align="stretch">
    <Card class="w-56">
      <Statistic label="Total reads" :value="1284000" format="compact" />
    </Card>
    <Card class="w-56">
      <Statistic label="Finish rate" :value="0.674" format="percent" :precision="1" />
    </Card>
    <Card class="w-56">
      <Statistic label="Spent this month" :value="128.5" format="currency" currency="USD" />
    </Card>
  </Inline>
</template>
