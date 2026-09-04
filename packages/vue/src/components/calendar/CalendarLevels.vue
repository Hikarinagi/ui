<script setup lang="ts">
  import { computed } from 'vue'
  import {
    MonthPickerCell,
    MonthPickerCellTrigger,
    MonthPickerGrid,
    MonthPickerGridBody,
    MonthPickerGridRow,
    MonthPickerNext,
    MonthPickerPrev,
    MonthPickerRoot,
    YearPickerCell,
    YearPickerCellTrigger,
    YearPickerGrid,
    YearPickerGridBody,
    YearPickerGridRow,
    YearPickerNext,
    YearPickerPrev,
    YearPickerRoot,
  } from 'reka-ui'
  import type { DateValue } from '@internationalized/date'
  import { useUiLocale } from '../../locale'
  import CalendarHeader from './CalendarHeader.vue'
  import type { CalendarLevel } from './composables/useCalendarLevels'
  import {
    formatDigits,
    formatMonthName,
    formatYearHeading,
    formatYearsHeading,
  } from './utils/format'
  import {
    calendarGrid,
    calendarPicker,
    calendarUnit,
    calendarUnitCell,
    calendarUnits,
    type CalendarVariants,
  } from './calendar.variants'

  defineOptions({ name: 'HnCalendarLevels' })

  type Picked = DateValue | DateValue[] | undefined

  const props = defineProps<{
    view: DateValue
    size?: CalendarVariants['size']
    minValue?: DateValue
    maxValue?: DateValue
    disabled?: boolean
  }>()
  const emit = defineEmits<{
    pickMonth: [value: Picked]
    pickYear: [value: Picked]
    followYear: [date: DateValue]
    back: []
    entered: []
  }>()

  const level = defineModel<CalendarLevel>('level', { required: true })

  const t = useUiLocale()
  const yearHeading = computed(() => formatYearHeading(t.value.tag, props.view))
</script>

<template>
  <Transition
    mode="out-in"
    enter-active-class="hn-transition-base"
    enter-from-class="scale-90 opacity-0"
    leave-active-class="hn-transition"
    leave-to-class="scale-90 opacity-0"
    @after-enter="emit('entered')"
  >
    <div v-if="level === 'day'" key="day" :class="calendarPicker()">
      <slot />
    </div>

    <MonthPickerRoot
      v-else-if="level === 'month'"
      key="month"
      v-slot="{ grid: months }"
      :placeholder="props.view"
      :model-value="props.view"
      :min-value="props.minValue"
      :max-value="props.maxValue"
      :locale="t.tag"
      :calendar-label="t.calendar.label"
      :disabled="props.disabled"
      prevent-deselect
      initial-focus
      :class="calendarPicker()"
      @update:model-value="emit('pickMonth', $event)"
      @update:placeholder="emit('followYear', $event)"
      @keydown.esc.stop.prevent="emit('back')"
    >
      <CalendarHeader
        :prev="MonthPickerPrev"
        :next="MonthPickerNext"
        :prev-label="t.calendar.prevYear"
        :next-label="t.calendar.nextYear"
        :heading="yearHeading"
        :pick-label="t.calendar.pickYear"
        :size="props.size"
        :disabled="props.disabled"
        @pick="level = 'year'"
      />
      <div :class="calendarUnits()">
        <MonthPickerGrid :class="calendarGrid({ units: true })">
          <MonthPickerGridBody>
            <MonthPickerGridRow v-for="(row, index) in months.rows" :key="index">
              <MonthPickerCell
                v-for="month in row"
                :key="month.toString()"
                :date="month"
                :class="calendarUnitCell()"
              >
                <MonthPickerCellTrigger :month="month" :class="calendarUnit()">
                  {{ formatMonthName(t.tag, month) }}
                </MonthPickerCellTrigger>
              </MonthPickerCell>
            </MonthPickerGridRow>
          </MonthPickerGridBody>
        </MonthPickerGrid>
      </div>
    </MonthPickerRoot>

    <YearPickerRoot
      v-else
      key="year"
      v-slot="{ grid: years }"
      :placeholder="props.view"
      :model-value="props.view"
      :min-value="props.minValue"
      :max-value="props.maxValue"
      :locale="t.tag"
      :calendar-label="t.calendar.label"
      :disabled="props.disabled"
      :years-per-page="12"
      prevent-deselect
      initial-focus
      :class="calendarPicker()"
      @update:model-value="emit('pickYear', $event)"
      @update:placeholder="emit('followYear', $event)"
      @keydown.esc.stop.prevent="emit('back')"
    >
      <CalendarHeader
        :prev="YearPickerPrev"
        :next="YearPickerNext"
        :prev-label="t.calendar.prevYears"
        :next-label="t.calendar.nextYears"
        :heading="formatYearsHeading(t.tag, years.cells)"
        :size="props.size"
      />
      <div :class="calendarUnits()">
        <YearPickerGrid :class="calendarGrid({ units: true })">
          <YearPickerGridBody>
            <YearPickerGridRow v-for="(row, index) in years.rows" :key="index">
              <YearPickerCell
                v-for="year in row"
                :key="year.toString()"
                :date="year"
                :class="calendarUnitCell()"
              >
                <YearPickerCellTrigger :year="year" :class="calendarUnit()">
                  {{ formatDigits(t.tag, year.year) }}
                </YearPickerCellTrigger>
              </YearPickerCell>
            </YearPickerGridRow>
          </YearPickerGridBody>
        </YearPickerGrid>
      </div>
    </YearPickerRoot>
  </Transition>
</template>
