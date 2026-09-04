<script setup lang="ts">
  import { computed, shallowRef, watch } from 'vue'
  import {
    RangeCalendarCell,
    RangeCalendarCellTrigger,
    RangeCalendarGrid,
    RangeCalendarGridBody,
    RangeCalendarGridHead,
    RangeCalendarGridRow,
    RangeCalendarHeadCell,
    RangeCalendarNext,
    RangeCalendarPrev,
    RangeCalendarRoot,
    type DateRange,
  } from 'reka-ui'
  import { getLocalTimeZone, today, type DateValue } from '@internationalized/date'
  import { cn } from '../../lib/cn'
  import {
    formatDateRange,
    formatDateValue,
    parseDateRange,
    parseDateValue,
    type DateRangeValue,
  } from '../../lib/date'
  import { useUiLocale } from '../../locale'
  import CalendarHeader from '../calendar/CalendarHeader.vue'
  import CalendarLevels from '../calendar/CalendarLevels.vue'
  import { useCalendarLevels } from '../calendar/composables/useCalendarLevels'
  import { formatMonthHeading } from '../calendar/utils/format'
  import {
    calendarGrid,
    calendarHeadCell,
    calendarRoot,
    type CalendarVariants,
  } from '../calendar/calendar.variants'
  import { useRangeAnchor } from './composables/useRangeAnchor'
  import { rangeCalendarCell, rangeCalendarDay } from './range-calendar.variants'
  import { maximumDaysMatcher } from './utils/limit'

  defineOptions({ name: 'HnRangeCalendar' })

  const props = withDefaults(
    defineProps<{
      min?: string
      max?: string
      maximumDays?: number
      unavailable?: (date: string) => boolean
      weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
      weekdayFormat?: 'narrow' | 'short'
      fixedWeeks?: boolean
      size?: CalendarVariants['size']
      autofocus?: boolean
      readonly?: boolean
      disabled?: boolean
      class?: string
    }>(),
    { weekdayFormat: 'narrow', fixedWeeks: true, size: 'md' },
  )

  const model = defineModel<DateRangeValue | null>({ default: null })
  const shown = defineModel<string>('placeholder')

  const t = useUiLocale()
  const root = shallowRef<{ $el: HTMLElement } | null>(null)

  const value = computed(() => parseDateRange(model.value))
  const placeholder = computed(() => parseDateValue(shown.value))
  const minValue = computed(() => parseDateValue(props.min))
  const maxValue = computed(() => parseDateValue(props.max))
  const weekStartsOn = computed(() => props.weekStartsOn ?? t.value.calendar.weekStartsOn)
  const unavailable = computed(() =>
    props.unavailable ? (date: DateValue) => props.unavailable!(formatDateValue(date)) : undefined,
  )
  const { anchor, onStartValue } = useRangeAnchor(computed(() => value.value.start))
  const limited = computed(() =>
    maximumDaysMatcher(anchor.value, value.value.end, props.maximumDays),
  )
  function isDateDisabled(date: DateValue) {
    return limited.value ? limited.value(date) : false
  }

  const { level, view, pickMonth, pickYear, followYear, back, onEntered } = useCalendarLevels(
    value.value.start ?? placeholder.value ?? today(getLocalTimeZone()),
    root,
  )
  watch(placeholder, next => {
    if (next && next.compare(view.value) !== 0) view.value = next
  })
  watch(view, next => {
    shown.value = formatDateValue(next)
  })

  const monthHeading = computed(() => formatMonthHeading(t.value.tag, view.value))

  function update(next: DateRange) {
    model.value = formatDateRange(next)
  }
</script>

<template>
  <RangeCalendarRoot
    ref="root"
    v-slot="{ weekDays, grid }"
    data-hn-range-calendar
    :data-level="level"
    :model-value="value"
    :placeholder="view"
    :min-value="minValue"
    :max-value="maxValue"
    :is-date-disabled="isDateDisabled"
    :is-date-unavailable="unavailable"
    :week-starts-on="weekStartsOn"
    :weekday-format="props.weekdayFormat"
    :fixed-weeks="props.fixedWeeks"
    :initial-focus="props.autofocus"
    :locale="t.tag"
    :calendar-label="t.calendar.label"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :class="cn(calendarRoot({ size: props.size }), props.class)"
    @update:model-value="update"
    @update:start-value="onStartValue"
    @update:placeholder="view = $event"
  >
    <CalendarLevels
      v-model:level="level"
      :view="view"
      :size="props.size"
      :min-value="minValue"
      :max-value="maxValue"
      :disabled="props.disabled"
      @pick-month="pickMonth"
      @pick-year="pickYear"
      @follow-year="followYear"
      @back="back"
      @entered="onEntered"
    >
      <CalendarHeader
        :prev="RangeCalendarPrev"
        :next="RangeCalendarNext"
        :prev-label="t.calendar.prev"
        :next-label="t.calendar.next"
        :heading="monthHeading"
        :pick-label="t.calendar.pickMonth"
        :size="props.size"
        :disabled="props.disabled"
        @pick="level = 'month'"
      />
      <RangeCalendarGrid
        v-for="month in grid"
        :key="month.value.toString()"
        :class="calendarGrid()"
      >
        <RangeCalendarGridHead>
          <RangeCalendarGridRow>
            <RangeCalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              :class="calendarHeadCell({ size: props.size })"
            >
              {{ day }}
            </RangeCalendarHeadCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridHead>
        <RangeCalendarGridBody>
          <RangeCalendarGridRow v-for="(week, index) in month.rows" :key="index">
            <RangeCalendarCell
              v-for="day in week"
              :key="day.toString()"
              :date="day"
              :class="rangeCalendarCell()"
            >
              <RangeCalendarCellTrigger
                :day="day"
                :month="month.value"
                :class="rangeCalendarDay()"
              />
            </RangeCalendarCell>
          </RangeCalendarGridRow>
        </RangeCalendarGridBody>
      </RangeCalendarGrid>
    </CalendarLevels>
  </RangeCalendarRoot>
</template>
