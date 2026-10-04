<script setup lang="ts">
  import { Card, Inline, Statistic } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="md" align="stretch">
    <Card class="w-56">
      <Statistic label="余额" :value="2480" prefix="¥" />
    </Card>
    <Card class="w-56">
      <Statistic label="平均时长" :value="42" suffix="分钟" />
    </Card>
  </Inline>
</template>
