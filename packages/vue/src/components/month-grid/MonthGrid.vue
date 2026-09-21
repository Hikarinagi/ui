<script setup lang="ts">
  import { computed, onMounted, ref, shallowRef, watch } from 'vue'
  import { CalendarDays } from '@lucide/vue'
  import { today as currentDate, type DateValue } from '@internationalized/date'
  import { monthGridDates, parseMonth, shiftMonth } from '../../../../shared/src/lib/month-grid'
  import { cn } from '../../lib/cn'
  import { useDirection } from '../../lib/useDirection'
  import { parseDateValue, formatDateValue } from '../../lib/date'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import IconButton from '../icon-button/IconButton.vue'
  import Popover from '../popover/Popover.vue'
  import CalendarHeader from '../calendar/CalendarHeader.vue'
  import CalendarLevels from '../calendar/CalendarLevels.vue'
  import { calendarHeading, calendarRoot } from '../calendar/calendar.variants'
  import type { CalendarLevel } from '../calendar/composables/useCalendarLevels'
  import {
    monthGrid,
    monthGridHeader,
    monthGridActions,
    monthGridTable,
    monthGridWeekday,
    monthGridCell,
    monthGridDay,
    monthGridDayHeader,
    monthGridDate,
  } from './month-grid.variants'
  import type {
    MonthGridProps,
    MonthGridDay,
    MonthGridRange,
    MonthGridHeader,
    MonthGridWeekday,
  } from './types'

  defineOptions({ name: 'HnMonthGrid' })
  const props = withDefaults(defineProps<Omit<MonthGridProps, 'month'>>(), {
    timeZone: 'UTC',
    weekdayFormat: 'short',
    fixedWeeks: true,
    showOutsideDays: true,
    showToday: true,
    showHeader: true,
    size: 'md',
  })
  const model = defineModel<string>('month')
  const emit = defineEmits<{ rangeChange: [range: MonthGridRange] }>()
  defineSlots<{
    default?(day: MonthGridDay): unknown
    day?(day: MonthGridDay): unknown
    date?(day: MonthGridDay): unknown
    'day-trailing'?(day: MonthGridDay): unknown
    header?(header: MonthGridHeader): unknown
    'header-actions'?(header: MonthGridHeader): unknown
    weekday?(weekday: MonthGridWeekday): unknown
    footer?(range: MonthGridRange): unknown
  }>()
  const t = useUiLocale()
  const { root, direction, rootDirection } = useDirection(() => props.dir)
  const length = (value: number | string | undefined) =>
    typeof value === 'number' ? `${Math.max(0, value)}px` : value
  const layout = computed(() => ({
    '--hn-month-grid-cell': length(props.dayMinHeight),
    '--hn-month-grid-padding': length(props.dayPadding),
  }))
  function dayClass(value: MonthGridProps['cellClass'], day: MonthGridDay) {
    return typeof value === 'function' ? value(day) : value
  }
  const today = computed(() =>
    formatDateValue(parseDateValue(props.today) ?? currentDate(props.timeZone)),
  )
  const limits = computed(() => {
    const min = parseDateValue(props.min)
    const max = parseDateValue(props.max)
    return min && max && min.compare(max) > 0 ? {} : { min, max }
  })
  const month = computed(() => {
    let value = parseMonth(model.value) ? model.value! : today.value.slice(0, 7)
    const min = limits.value.min?.toString().slice(0, 7)
    const max = limits.value.max?.toString().slice(0, 7)
    if (min && value < min) value = min
    if (max && value > max) value = max
    return value
  })
  const weekStartsOn = computed(() => props.weekStartsOn ?? t.value.calendar.weekStartsOn)
  const dates = computed(() => monthGridDates(month.value, weekStartsOn.value, props.fixedWeeks))
  const range = computed<MonthGridRange>(() => ({
    month: month.value,
    start: dates.value[0]![0]!,
    end: dates.value.at(-1)!.at(-1)!,
  }))
  const dateFormatter = computed(
    () =>
      new Intl.DateTimeFormat(t.value.tag, {
        dateStyle: 'full',
        timeZone: 'UTC',
        calendar: 'gregory',
      }),
  )
  const numberFormatter = computed(() => new Intl.NumberFormat(t.value.tag, { useGrouping: false }))
  const label = computed(() =>
    new Intl.DateTimeFormat(t.value.tag, {
      year: 'numeric',
      month: 'long',
      timeZone: 'UTC',
      calendar: 'gregory',
    }).format(new Date(`${month.value}-01T00:00:00Z`)),
  )
  const weeks = computed<MonthGridDay[][]>(() =>
    dates.value.map(week =>
      week.map(date => ({
        date,
        day: Number(date.slice(-2)),
        dayLabel: numberFormatter.value.format(Number(date.slice(-2))),
        weekday: new Date(`${date}T00:00:00Z`).getUTCDay() as MonthGridDay['weekday'],
        label: dateFormatter.value.format(new Date(`${date}T00:00:00Z`)),
        isToday: date === today.value,
        isPast: date < today.value,
        isFuture: date > today.value,
        isOutside: date.slice(0, 7) !== month.value,
        isDisabled:
          !!props.disabled ||
          !/^\d{4}-/.test(date) ||
          date.startsWith('0000') ||
          !!(limits.value.min && date < limits.value.min.toString()) ||
          !!(limits.value.max && date > limits.value.max.toString()),
      })),
    ),
  )
  const weekdays = computed<MonthGridWeekday[]>(() => {
    const short = new Intl.DateTimeFormat(t.value.tag, {
      weekday: props.weekdayFormat,
      timeZone: 'UTC',
    })
    const full = new Intl.DateTimeFormat(t.value.tag, { weekday: 'long', timeZone: 'UTC' })
    return dates.value[0]!.map(date => {
      const value = new Date(`${date}T00:00:00Z`)
      return { day: value.getUTCDay(), label: short.format(value), fullLabel: full.format(value) }
    })
  })
  function allowed(value: string) {
    return (
      !props.disabled &&
      value !== month.value &&
      (!limits.value.min || value >= limits.value.min.toString().slice(0, 7)) &&
      (!limits.value.max || value <= limits.value.max.toString().slice(0, 7))
    )
  }
  function navigate(value: string) {
    if (parseMonth(value) && allowed(value)) model.value = value
  }
  const header = computed<MonthGridHeader>(() => ({
    ...range.value,
    label: label.value,
    canPrev: allowed(shiftMonth(month.value, -1)),
    canNext: allowed(shiftMonth(month.value, 1)),
    canToday: allowed(today.value.slice(0, 7)),
    prev: () => navigate(shiftMonth(month.value, -1)),
    next: () => navigate(shiftMonth(month.value, 1)),
    goToToday: () => navigate(today.value.slice(0, 7)),
  }))
  const pickerOpen = ref(false)
  const level = ref<CalendarLevel>('month')
  const pickerView = shallowRef<DateValue>(parseDateValue(`${month.value}-01`)!)
  watch(pickerOpen, open => {
    if (open) {
      pickerView.value = parseDateValue(`${month.value}-01`)!
      level.value = 'month'
    }
  })
  watch(
    () => [props.disabled, props.showHeader],
    ([disabled, showHeader]) => {
      if (disabled || !showHeader) pickerOpen.value = false
    },
  )
  function pickMonth(value: DateValue | DateValue[] | undefined) {
    const date = Array.isArray(value) ? value[0] : value
    if (date) {
      navigate(formatDateValue(date).slice(0, 7))
      pickerOpen.value = false
    }
  }
  function pickYear(value: DateValue | DateValue[] | undefined) {
    const date = Array.isArray(value) ? value[0] : value
    if (date) {
      pickerView.value = pickerView.value.set({ year: date.year })
      level.value = 'month'
    }
  }
  function back() {
    if (level.value === 'year') level.value = 'month'
    else pickerOpen.value = false
  }
  let mounted = false
  onMounted(() => {
    mounted = true
    emit('rangeChange', range.value)
  })
  watch(range, value => {
    if (mounted) emit('rangeChange', value)
  })
  defineExpose({
    range,
    prev: () => header.value.prev(),
    next: () => header.value.next(),
    goToToday: () => header.value.goToToday(),
  })
</script>

<template>
  <div
    ref="root"
    data-hn-month-grid
    :dir="rootDirection"
    :class="cn(monthGrid({ size: props.size }), props.class)"
    :style="layout"
  >
    <div v-if="props.showHeader" data-hn-month-grid-header :class="monthGridHeader()">
      <slot name="header" v-bind="header">
        <div class="flex min-w-0 flex-1 items-center gap-2">
          <CalendarHeader
            class="min-w-0 flex-1"
            :prev-label="t.calendar.prev"
            :next-label="t.calendar.next"
            :heading="label"
            :prev-disabled="!header.canPrev"
            :next-disabled="!header.canNext"
            :disabled="props.disabled"
            :size="props.size"
            @prev="header.prev"
            @next="header.next"
          >
            <template #heading>
              <Popover v-model:open="pickerOpen" :aria-label="t.calendar.pickMonth">
                <Button
                  variant="ghost"
                  tone="neutral"
                  :size="props.size"
                  :disabled="props.disabled"
                  :class="calendarHeading()"
                  :aria-label="`${t.calendar.pickMonth}: ${label}`"
                >
                  <span class="truncate">{{ label }}</span>
                </Button>
                <template #content>
                  <div :dir="direction" :class="calendarRoot({ size: props.size })">
                    <CalendarLevels
                      v-model:level="level"
                      :view="pickerView"
                      :dir="direction"
                      :size="props.size"
                      :min-value="limits.min"
                      :max-value="limits.max"
                      :disabled="props.disabled"
                      @pick-month="pickMonth"
                      @pick-year="pickYear"
                      @follow-year="pickerView = $event"
                      @back="back"
                    />
                  </div>
                </template>
              </Popover>
            </template>
          </CalendarHeader>
          <IconButton
            v-if="props.showToday"
            :label="t.monthGrid.today"
            :size="props.size"
            :disabled="!header.canToday"
            @click="header.goToToday"
          >
            <CalendarDays />
          </IconButton>
        </div>
        <div v-if="$slots['header-actions']" :class="monthGridActions()">
          <slot name="header-actions" v-bind="header" />
        </div>
      </slot>
    </div>
    <table :class="monthGridTable()">
      <caption class="sr-only">{{ props.label ?? t.calendar.label }} · {{ label }}</caption>
      <thead>
        <tr>
          <th
            v-for="weekday in weekdays"
            :key="weekday.day"
            scope="col"
            :abbr="weekday.fullLabel"
            :class="monthGridWeekday()"
          >
            <slot name="weekday" v-bind="weekday">{{ weekday.label }}</slot>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, index) in weeks" :key="week[0]!.date">
          <td
            v-for="day in week"
            :key="day.date"
            :data-date="day.date"
            :data-outside="day.isOutside ? '' : undefined"
            :data-today="day.isToday ? '' : undefined"
            :data-disabled="day.isDisabled ? '' : undefined"
            :class="
              cn(
                monthGridCell(),
                index === weeks.length - 1 && 'border-b-0',
                dayClass(props.cellClass, day),
              )
            "
          >
            <div data-hn-month-grid-day :class="cn(monthGridDay(), dayClass(props.dayClass, day))">
              <template v-if="props.showOutsideDays || !day.isOutside">
                <slot name="day" v-bind="day">
                  <div :class="monthGridDayHeader()">
                    <time
                      :datetime="day.date"
                      :aria-label="day.label"
                      :aria-current="day.isToday ? 'date' : undefined"
                      :data-today="day.isToday ? '' : undefined"
                      :data-outside="day.isOutside ? '' : undefined"
                      :data-disabled="day.isDisabled ? '' : undefined"
                      :class="monthGridDate()"
                    >
                      <slot name="date" v-bind="day">{{ day.dayLabel }}</slot>
                    </time>
                    <div v-if="$slots['day-trailing']" class="min-w-0 text-end">
                      <slot name="day-trailing" v-bind="day" />
                    </div>
                  </div>
                  <slot v-bind="day" />
                </slot>
              </template>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="$slots.footer" class="border-line border-t p-3">
      <slot name="footer" v-bind="range" />
    </div>
  </div>
</template>
