<script setup lang="ts">
  import { BookOpen } from '@lucide/vue'
  import { Card, Statistic } from '@hina-ui/vue'

  const { t } = useI18n()
</script>

<template>
  <Card class="w-[260px]">
    <Statistic
      :label="t('landing.wall.stats.label')"
      :value="12480"
      :delta="0.12"
      :delta-label="t('landing.wall.stats.delta')"
    >
      <template #icon><BookOpen /></template>
    </Statistic>
  </Card>
</template>
