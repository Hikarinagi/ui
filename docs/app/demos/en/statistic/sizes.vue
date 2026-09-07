<script setup lang="ts">
  import { Card, Inline, Statistic } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="md" align="stretch">
    <Card class="w-48">
      <Statistic label="Reading" :value="12480" size="sm" />
    </Card>
    <Card class="w-48">
      <Statistic label="Reading" :value="12480" />
    </Card>
    <Card class="w-48">
      <Statistic label="Reading" :value="12480" size="lg" />
    </Card>
  </Inline>
</template>
