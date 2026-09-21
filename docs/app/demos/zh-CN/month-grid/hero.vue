<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Button, MonthGrid, Popover, SegmentedControl, Stack, Tag, Text } from '@hina-ui/vue'
  import { monthGridSchedule } from '../../month-grid'
  const month = ref('2026-09')
  const category = ref('all')
  const events = monthGridSchedule('zh-CN')
  const completed = ref<number[]>([])
  const filters = [
    { value: 'all', label: '全部' },
    { value: 'design', label: '设计' },
    { value: 'release', label: '发布' },
  ]
  const filtered = computed(() =>
    events.filter(event => category.value === 'all' || event.kind === category.value),
  )
  const visible = computed(() => filtered.value.filter(event => event.date.startsWith(month.value)))
  const byDate = computed(() => {
    const result = new Map<string, typeof events>()
    for (const event of filtered.value)
      result.set(event.date, [...(result.get(event.date) ?? []), event])
    return result
  })
  const onDate = (date: string) => byDate.value.get(date) ?? []
  function toggle(id: number) {
    completed.value = completed.value.includes(id)
      ? completed.value.filter(value => value !== id)
      : [...completed.value, id]
  }
</script>

<template>
  <Stack class="w-full max-w-4xl" gap="sm">
    <MonthGrid
      v-model:month="month"
      today="2026-09-21"
      :day-min-height="124"
      day-class="@max-[520px]/hn-month-grid:min-h-20"
      label="团队日程"
    >
      <template #header-actions>
        <SegmentedControl v-model="category" :options="filters" size="sm" aria-label="日程分类" />
      </template>
      <template #day-trailing="{ date }">
        <Text
          v-if="onDate(date).length"
          size="xs"
          tone="muted"
          :aria-label="`${onDate(date).length} 项日程`"
          class="@max-[520px]/hn-month-grid:hidden"
        >
          {{ onDate(date).length }}
        </Text>
      </template>
      <template #default="{ date, label }">
        <Stack v-if="onDate(date).length" gap="xs" class="min-w-0">
          <Text
            v-for="event in onDate(date).slice(0, 2)"
            :key="event.id"
            size="xs"
            class="min-w-0 truncate rounded-sm border-s-2 bg-subtle px-1 py-0.5 @max-[520px]/hn-month-grid:hidden"
            :class="`${event.kind === 'design' ? 'border-accent' : 'border-warning'} ${completed.includes(event.id) ? 'text-muted line-through' : ''}`"
          >
            {{ event.title }}
          </Text>
          <Popover :aria-label="`${label} · 项日程`">
            <Button
              as-child
              variant="ghost"
              tone="neutral"
              size="sm"
              :ripple="false"
              class="hn-press-none h-auto w-full min-w-0 justify-start px-1 py-1"
            >
              <Text
                as="button"
                type="button"
                size="xs"
                class="truncate text-start"
                :aria-label="`${label}, ${onDate(date).length} 项日程`"
              >
                <Text as="span" size="inherit" class="@max-[520px]/hn-month-grid:hidden">
                  {{ onDate(date).length > 2 ? `+${onDate(date).length - 2} 项` : '查看' }}
                </Text>
                <Text as="span" size="inherit" class="hidden @max-[520px]/hn-month-grid:inline">
                  {{ onDate(date).length }}项
                </Text>
              </Text>
            </Button>
            <template #content>
              <Stack class="w-60" gap="lg">
                <Text size="sm" weight="medium">{{ label }}</Text>
                <Stack v-for="event in onDate(date)" :key="event.id" gap="xs">
                  <Text size="sm">{{ event.time }} · {{ event.title }}</Text>
                  <Button
                    size="sm"
                    variant="link"
                    tone="neutral"
                    class="self-start"
                    @click="toggle(event.id)"
                  >
                    {{ completed.includes(event.id) ? '撤销完成' : '标记完成' }}
                  </Button>
                  <Tag
                    v-if="completed.includes(event.id)"
                    size="sm"
                    tone="success"
                    class="self-start"
                  >
                    已完成
                  </Tag>
                </Stack>
              </Stack>
            </template>
          </Popover>
        </Stack>
      </template>
      <template #footer>
        <Text size="sm" tone="muted">
          本月 {{ visible.length }} 项日程，已完成
          {{ visible.filter(event => completed.includes(event.id)).length }} 项。
        </Text>
      </template>
    </MonthGrid>
    <Text size="sm" tone="muted">
      按分类筛选，保留默认月份导航。每天展示两条日程，更多内容通过浮层展开；窄屏只保留数量入口。
    </Text>
  </Stack>
</template>
