<script setup lang="ts">
  import { ref } from 'vue'
  import { Check } from '@lucide/vue'
  import { Button, Inline, MonthGrid, Stack, Text, type MonthGridDay } from '@hina-ui/vue'
  const signed = ref([1, 2, 3, 4, 7, 8, 9, 10, 11, 14, 15, 16, 17, 18])
  function cellClass(day: MonthGridDay) {
    if (day.isOutside) return
    if (signed.value.includes(day.day)) return 'bg-accent-soft/40'
    if (day.weekday === 0 || day.weekday === 6 || day.date === '2026-09-25') return 'bg-subtle'
  }
</script>

<template>
  <Stack class="w-full max-w-lg" gap="sm">
    <Inline justify="between">
      <Text weight="medium">每月签到</Text>
      <Text size="sm" tone="muted">2026 年 9 月</Text>
    </Inline>
    <MonthGrid
      month="2026-09"
      today="2026-09-21"
      :show-header="false"
      :show-outside-days="false"
      :day-min-height="72"
      :fixed-weeks="false"
      :cell-class="cellClass"
      size="sm"
      label="九月签到记录"
    >
      <template #day-trailing="{ date, day, label }">
        <Text
          v-if="signed.includes(day)"
          as="span"
          tone="accent"
          class="inline-flex"
          :aria-label="`${label} · 已签到`"
        >
          <Check class="size-3" aria-hidden="true" />
        </Text>
        <Text v-else-if="date === '2026-09-25'" size="xs" tone="muted" aria-label="团队休假日">
          休
        </Text>
      </template>
      <template #default="{ isToday, day, label }">
        <Button
          v-if="isToday && !signed.includes(day)"
          size="sm"
          variant="soft"
          class="hn-press-none h-6 min-w-0 px-1 text-xs"
          :aria-label="`${label} · 签到`"
          @click="signed.push(day)"
        >
          签到
        </Button>
      </template>
    </MonthGrid>
    <Text size="sm" tone="muted" role="status">
      本月已签到 {{ signed.length }} 天。浅色底表示已签到；25 日为团队休假日。
    </Text>
  </Stack>
</template>
