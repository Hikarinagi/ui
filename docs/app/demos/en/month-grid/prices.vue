<script setup lang="ts">
  import { ref } from 'vue'
  import { Button, Inline, MonthGrid, Stack, Text, type MonthGridDay } from '@hina-ui/vue'
  import { monthGridPrices } from '../../month-grid'
  const prices = monthGridPrices()
  const selected = ref('')
  const price = (date: string) => prices[date]
  function cellClass(day: MonthGridDay) {
    if (selected.value === day.date) return 'bg-accent-soft'
    if (!day.isOutside && (day.isPast || !price(day.date)?.rooms)) return 'bg-subtle'
  }
</script>

<template>
  <Stack class="w-full max-w-2xl" gap="sm">
    <Inline justify="between" wrap>
      <Text weight="medium">Nightly rates</Text>
      <Text size="sm" tone="muted">September 2026 · per night</Text>
    </Inline>
    <MonthGrid
      month="2026-09"
      today="2026-09-21"
      :show-header="false"
      :show-outside-days="false"
      :fixed-weeks="false"
      :day-min-height="104"
      :day-padding="0"
      :cell-class="cellClass"
      day-class="gap-0 @max-[480px]/hn-month-grid:min-h-24"
      label="September room rates"
    >
      <template #day="{ date, dayLabel, label, isPast, isToday }">
        <Button
          as-child
          variant="ghost"
          tone="neutral"
          size="sm"
          :ripple="false"
          :disabled="isPast || !price(date)?.rooms"
          class="hn-press-none h-auto w-full flex-1 items-center justify-between gap-1 rounded-none border-0 px-1 py-2 text-center focus-visible:outline-offset-[-2px] @min-[480px]/hn-month-grid:items-start @min-[480px]/hn-month-grid:px-3 @min-[480px]/hn-month-grid:text-start"
          @click="selected = date"
        >
          <Stack
            as="button"
            type="button"
            :disabled="isPast || !price(date)?.rooms"
            :aria-pressed="selected === date"
            :aria-label="`${label}, ${price(date)?.rooms ? `¥${price(date)!.price}, ${price(date)!.rooms} rooms left` : 'Sold out'}`"
          >
            <Text
              as="time"
              :datetime="date"
              :aria-current="isToday ? 'date' : undefined"
              size="sm"
              :tone="isToday ? 'accent' : 'default'"
              :weight="isToday ? 'medium' : 'normal'"
            >
              {{ dayLabel }}
            </Text>
            <Text
              v-if="price(date)?.rooms"
              size="xs"
              :tone="isPast ? 'muted' : 'accent'"
              class="@min-[480px]/hn-month-grid:text-sm"
            >
              ¥{{ price(date)!.price }}
            </Text>
            <Text v-else size="xs" tone="muted">
              <Text as="span" size="inherit" class="@max-[480px]/hn-month-grid:hidden">
                Sold out
              </Text>
              <Text as="span" size="inherit" class="hidden @max-[480px]/hn-month-grid:inline">
                Full
              </Text>
            </Text>
            <Text size="xs" tone="muted" aria-hidden="true">
              <Text as="span" size="inherit" class="@max-[480px]/hn-month-grid:hidden">
                {{ isPast ? 'Past' : price(date)?.rooms ? `${price(date)!.rooms} left` : 'Full' }}
              </Text>
              <Text as="span" size="inherit" class="hidden @max-[480px]/hn-month-grid:inline">
                {{ !isPast && price(date)?.rooms ? `${price(date)!.rooms} rm` : '—' }}
              </Text>
            </Text>
          </Stack>
        </Button>
      </template>
      <template #footer>
        <Text size="sm" tone="muted" role="status">
          {{
            selected
              ? `Selected ${selected}, ¥${price(selected)!.price} / night`
              : 'Choose an available date. Past dates and sold-out dates are disabled.'
          }}
        </Text>
      </template>
    </MonthGrid>
    <Text size="sm" tone="muted">
      The action fills the day content area; cellClass controls its background. Prices, availability
      and selection belong to the caller.
    </Text>
  </Stack>
</template>
