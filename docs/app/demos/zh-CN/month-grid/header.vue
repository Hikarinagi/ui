<script setup lang="ts">
  import { ref } from 'vue'
  import { ChevronLeft, ChevronRight } from '@lucide/vue'
  import { IconButton, Inline, MonthGrid, Select, Stack, Switch, Text } from '@hina-ui/vue'
  const month = ref('2026-09')
  const fixed = ref(false)
  const outside = ref(false)
  const options = [
    { label: '2026 年 9 月', value: '2026-09' },
    { label: '2026 年 10 月', value: '2026-10' },
    { label: '2026 年 11 月', value: '2026-11' },
  ]
</script>

<template>
  <Stack class="w-full max-w-lg">
    <Inline gap="lg" wrap>
      <Switch v-model="fixed">固定六周</Switch>
      <Switch v-model="outside">显示相邻月份</Switch>
    </Inline>
    <MonthGrid
      v-model:month="month"
      today="2026-09-21"
      min="2026-09-10"
      max="2026-11-20"
      :fixed-weeks="fixed"
      :show-outside-days="outside"
      :week-starts-on="0"
      size="sm"
      label="开放日期范围"
    >
      <template #header="{ prev, next, canPrev, canNext }">
        <IconButton label="上个月" size="sm" :disabled="!canPrev" @click="prev">
          <ChevronLeft class="rtl:rotate-180" />
        </IconButton>
        <Select
          v-model="month"
          :options="options"
          size="sm"
          aria-label="月份"
          class="min-w-0 flex-1"
        />
        <IconButton label="下个月" size="sm" :disabled="!canNext" @click="next">
          <ChevronRight class="rtl:rotate-180" />
        </IconButton>
      </template>
      <template #default="{ isDisabled, isOutside }">
        <Text v-if="!isOutside" size="xs" tone="muted" class="text-center">
          {{ isDisabled ? '—' : '开放' }}
        </Text>
      </template>
      <template #footer>
        <Text size="xs" tone="muted">开放范围：9 月 10 日至 11 月 20 日。每周从周日开始。</Text>
      </template>
    </MonthGrid>
  </Stack>
</template>
