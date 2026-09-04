<script setup lang="ts">
  import { computed, shallowRef, watch } from 'vue'
  import {
    CalendarCell,
    CalendarCellTrigger,
    CalendarGrid,
    CalendarGridBody,
    CalendarGridHead,
    CalendarGridRow,
    CalendarHeadCell,
    CalendarNext,
    CalendarPrev,
    CalendarRoot,
  } from 'reka-ui'
  import { getLocalTimeZone, today, type DateValue } from '@internationalized/date'
  import { cn } from '../../lib/cn'
  import { formatDateValue, parseDateValue } from '../../lib/date'
  import { useUiLocale } from '../../locale'
  import CalendarHeader from './CalendarHeader.vue'
  import CalendarLevels from './CalendarLevels.vue'
  import { useCalendarLevels } from './composables/useCalendarLevels'
  import { formatMonthHeading } from './utils/format'
  import {
    calendarCell,
    calendarDay,
    calendarGrid,
    calendarHeadCell,
    calendarRoot,
    type CalendarVariants,
  } from './calendar.variants'

  defineOptions({ name: 'HnCalendar' })

  const props = withDefaults(
    defineProps<{
      min?: string
      max?: string
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

  const model = defineModel<string | null>({ default: null })
  const shown = defineModel<string>('placeholder')

  const t = useUiLocale()
  const root = shallowRef<{ $el: HTMLElement } | null>(null)

  const value = computed(() => parseDateValue(model.value))
  const placeholder = computed(() => parseDateValue(shown.value))
  const minValue = computed(() => parseDateValue(props.min))
  const maxValue = computed(() => parseDateValue(props.max))
  const weekStartsOn = computed(() => props.weekStartsOn ?? t.value.calendar.weekStartsOn)
  const unavailable = computed(() =>
    props.unavailable ? (date: DateValue) => props.unavailable!(formatDateValue(date)) : undefined,
  )

  const { level, view, pickMonth, pickYear, followYear, back, onEntered } = useCalendarLevels(
    value.value ?? placeholder.value ?? today(getLocalTimeZone()),
    root,
  )
  watch(placeholder, next => {
    if (next && next.compare(view.value) !== 0) view.value = next
  })
  watch(view, next => {
    shown.value = formatDateValue(next)
  })

  const monthHeading = computed(() => formatMonthHeading(t.value.tag, view.value))

  function update(next: DateValue | DateValue[] | undefined) {
    const picked = Array.isArray(next) ? next[0] : next
    model.value = picked ? formatDateValue(picked) : null
  }
</script>

<template>
  <CalendarRoot
    ref="root"
    v-slot="{ weekDays, grid }"
    data-hn-calendar
    :data-level="level"
    :model-value="value"
    :placeholder="view"
    :min-value="minValue"
    :max-value="maxValue"
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
        :prev="CalendarPrev"
        :next="CalendarNext"
        :prev-label="t.calendar.prev"
        :next-label="t.calendar.next"
        :heading="monthHeading"
        :pick-label="t.calendar.pickMonth"
        :size="props.size"
        :disabled="props.disabled"
        @pick="level = 'month'"
      />
      <CalendarGrid v-for="month in grid" :key="month.value.toString()" :class="calendarGrid()">
        <CalendarGridHead>
          <CalendarGridRow>
            <CalendarHeadCell
              v-for="day in weekDays"
              :key="day"
              :class="calendarHeadCell({ size: props.size })"
            >
              {{ day }}
            </CalendarHeadCell>
          </CalendarGridRow>
        </CalendarGridHead>
        <CalendarGridBody>
          <CalendarGridRow v-for="(week, index) in month.rows" :key="index">
            <CalendarCell
              v-for="day in week"
              :key="day.toString()"
              :date="day"
              :class="calendarCell()"
            >
              <CalendarCellTrigger :day="day" :month="month.value" :class="calendarDay()" />
            </CalendarCell>
          </CalendarGridRow>
        </CalendarGridBody>
      </CalendarGrid>
    </CalendarLevels>
  </CalendarRoot>
</template>
