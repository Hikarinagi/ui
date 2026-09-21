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
      <Text weight="medium">Monthly check-ins</Text>
      <Text size="sm" tone="muted">September 2026</Text>
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
      label="September check-ins"
    >
      <template #day-trailing="{ date, day, label }">
        <Text
          v-if="signed.includes(day)"
          as="span"
          tone="accent"
          class="inline-flex"
          :aria-label="`${label} · Checked in`"
        >
          <Check class="size-3" aria-hidden="true" />
        </Text>
        <Text v-else-if="date === '2026-09-25'" size="xs" tone="muted" aria-label="Team day off">
          Off
        </Text>
      </template>
      <template #default="{ isToday, day, label }">
        <Button
          v-if="isToday && !signed.includes(day)"
          size="sm"
          variant="soft"
          class="hn-press-none h-6 min-w-0 px-1 text-xs"
          :aria-label="`${label} · Check in`"
          @click="signed.push(day)"
        >
          +1
        </Button>
      </template>
    </MonthGrid>
    <Text size="sm" tone="muted" role="status">
      {{ signed.length }} check-ins this month. Tinted days are complete; September 25 is a team day
      off.
    </Text>
  </Stack>
</template>
