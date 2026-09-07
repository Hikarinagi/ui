<script setup lang="ts">
  import { Card, Inline, Statistic } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="md" align="stretch">
    <Card class="w-56">
      <Statistic label="在读" :value="12480" />
    </Card>
    <Card class="w-56">
      <Statistic label="状态" value="正常" />
    </Card>
  </Inline>
</template>
