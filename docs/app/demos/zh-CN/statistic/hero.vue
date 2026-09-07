<script setup lang="ts">
  import { BookOpen, Clock, Users } from '@lucide/vue'
  import { Card, Grid, Statistic } from '@hina-ui/vue'
</script>

<template>
  <Grid :cols="3" gap="md" class="w-full max-w-3xl">
    <Card>
      <Statistic label="本月阅读页数" :value="12480" :delta="0.12" delta-label="较上月">
        <template #icon><BookOpen /></template>
      </Statistic>
    </Card>
    <Card>
      <Statistic label="阅读时长" :value="36.5" suffix="小时" :delta="-0.08" delta-label="较上月">
        <template #icon><Clock /></template>
      </Statistic>
    </Card>
    <Card>
      <Statistic label="新增关注" :value="212" :delta="0.31" delta-label="较上月">
        <template #icon><Users /></template>
      </Statistic>
    </Card>
  </Grid>
</template>
