<script setup lang="ts">
  import { Card, Inline, Statistic } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="md" align="stretch">
    <Card class="w-56">
      <Statistic label="Reading" :value="12480" />
    </Card>
    <Card class="w-56">
      <Statistic label="Status" value="Healthy" />
    </Card>
  </Inline>
</template>
