<script setup lang="ts">
  import { Card, Inline, Statistic } from '@hina-ui/vue'
</script>

<template>
  <Inline gap="md" align="stretch">
    <Card class="w-56">
      <Statistic label="新增书评" :value="86" :delta="0.18" delta-label="较上周" />
    </Card>
    <Card class="w-56">
      <Statistic label="活跃读者" :value="1204" :delta="-0.05" delta-label="较上周" />
    </Card>
    <Card class="w-56">
      <Statistic label="举报" :value="3" :delta="-0.4" delta-label="较上周" invert />
    </Card>
  </Inline>
</template>
