<script setup lang="ts">
  import { computed, ref } from 'vue'
  import { Button, MonthGrid, Popover, SegmentedControl, Stack, Tag, Text } from '@hina-ui/vue'
  import { monthGridSchedule } from '../../month-grid'
  const month = ref('2026-09')
  const category = ref('all')
  const events = monthGridSchedule('en')
  const completed = ref<number[]>([])
  const filters = [
    { value: 'all', label: 'All' },
    { value: 'design', label: 'Design' },
    { value: 'release', label: 'Release' },
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
      label="Team schedule"
    >
      <template #header-actions>
        <SegmentedControl
          v-model="category"
          :options="filters"
          size="sm"
          aria-label="Schedule category"
        />
      </template>
      <template #day-trailing="{ date }">
        <Text
          v-if="onDate(date).length"
          size="xs"
          tone="muted"
          :aria-label="`${onDate(date).length} events`"
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
          <Popover :aria-label="`${label} · events`">
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
                :aria-label="`${label}, ${onDate(date).length} events`"
              >
                <Text as="span" size="inherit" class="@max-[520px]/hn-month-grid:hidden">
                  {{ onDate(date).length > 2 ? `+${onDate(date).length - 2} more` : 'Details' }}
                </Text>
                <Text as="span" size="inherit" class="hidden @max-[520px]/hn-month-grid:inline">
                  {{ onDate(date).length }}
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
                    {{ completed.includes(event.id) ? 'Undo completion' : 'Mark complete' }}
                  </Button>
                  <Tag
                    v-if="completed.includes(event.id)"
                    size="sm"
                    tone="success"
                    class="self-start"
                  >
                    Completed
                  </Tag>
                </Stack>
              </Stack>
            </template>
          </Popover>
        </Stack>
      </template>
      <template #footer>
        <Text size="sm" tone="muted">
          {{ visible.length }} events this month,
          {{ visible.filter(event => completed.includes(event.id)).length }} completed.
        </Text>
      </template>
    </MonthGrid>
    <Text size="sm" tone="muted">
      Filter by category while keeping the default month navigation. Each day shows two entries with
      a details popover; narrow layouts use counts.
    </Text>
  </Stack>
</template>
