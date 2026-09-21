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
      <Text weight="medium">每日房价</Text>
      <Text size="sm" tone="muted">2026 年 9 月 · 每晚</Text>
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
      label="九月房价"
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
            :aria-label="`${label}，${price(date)?.rooms ? `¥${price(date)!.price}，剩余 ${price(date)!.rooms} 间` : '售罄'}`"
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
            <Text v-else size="xs" tone="muted" class="max-w-full truncate">售罄</Text>
            <Text size="xs" tone="muted" aria-hidden="true">
              <Text as="span" size="inherit" class="@max-[480px]/hn-month-grid:hidden">
                {{
                  isPast ? '已过期' : price(date)?.rooms ? `余 ${price(date)!.rooms} 间` : '无房'
                }}
              </Text>
              <Text as="span" size="inherit" class="hidden @max-[480px]/hn-month-grid:inline">
                {{ !isPast && price(date)?.rooms ? `${price(date)!.rooms}间` : '—' }}
              </Text>
            </Text>
          </Stack>
        </Button>
      </template>
      <template #footer>
        <Text size="sm" tone="muted" role="status">
          {{
            selected
              ? `已选择 ${selected}，¥${price(selected)!.price} / 晚`
              : '选择可预订的日期。已过期及售罄日期不可操作。'
          }}
        </Text>
      </template>
    </MonthGrid>
    <Text size="sm" tone="muted">
      整格按钮铺满内部空间，背景由 cellClass 控制。价格、库存与选中状态均由业务持有。
    </Text>
  </Stack>
</template>
