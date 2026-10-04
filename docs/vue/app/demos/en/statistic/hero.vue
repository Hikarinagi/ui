<script setup lang="ts">
  import { BookOpen, Clock, Users } from '@lucide/vue'
  import { Card, Grid, Statistic } from '@hina-ui/vue'
</script>

<template>
  <Grid :cols="3" gap="md" class="w-full max-w-3xl">
    <Card>
      <Statistic label="Pages this month" :value="12480" :delta="0.12" delta-label="vs last month">
        <template #icon><BookOpen /></template>
      </Statistic>
    </Card>
    <Card>
      <Statistic
        label="Reading time"
        :value="36.5"
        suffix="h"
        :delta="-0.08"
        delta-label="vs last month"
      >
        <template #icon><Clock /></template>
      </Statistic>
    </Card>
    <Card>
      <Statistic label="New followers" :value="212" :delta="0.31" delta-label="vs last month">
        <template #icon><Users /></template>
      </Statistic>
    </Card>
  </Grid>
</template>
