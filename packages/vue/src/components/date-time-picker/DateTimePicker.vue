<script setup lang="ts">
  import { computed, shallowRef, useSlots } from 'vue'
  import {
    PopoverAnchor,
    PopoverContent,
    PopoverPortal,
    PopoverRoot,
    PopoverTrigger,
  } from 'reka-ui'
  import { CalendarClock } from '@lucide/vue'
  import { cn } from '../../lib/cn'
  import { joinDateTime, splitDateTime, type TimeGranularity } from '../../lib/date'
  import { useUiLocale } from '../../locale'
  import Button from '../button/Button.vue'
  import Calendar from '../calendar/Calendar.vue'
  import type { CalendarVariants } from '../calendar/calendar.variants'
  import Card from '../card/Card.vue'
  import DateField from '../date-field/DateField.vue'
  import { datePickerContent } from '../date-picker/date-picker.variants'
  import { useFieldControl } from '../form-field/context'
  import { injectInputGroup } from '../input-group/context'
  import InputGroupScope from '../input-group/InputGroupScope.vue'
  import InputAction from '../input/InputAction.vue'
  import { inputEmbedded, inputHost, type InputVariants } from '../input/input.variants'
  import TimeField from '../time-field/TimeField.vue'
  import { dateTimePickerFooter } from './date-time-picker.variants'

  defineOptions({ name: 'HnDateTimePicker', inheritAttrs: false })

  const props = withDefaults(
    defineProps<{
      placeholder?: string
      min?: string
      max?: string
      granularity?: Exclude<TimeGranularity, 'hour'>
      hourCycle?: 12 | 24
      minuteStep?: number
      unavailable?: (date: string) => boolean
      weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6
      weekdayFormat?: 'narrow' | 'short'
      fixedWeeks?: boolean
      clearable?: boolean
      readonly?: boolean
      name?: string
      variant?: InputVariants['variant']
      size?: InputVariants['size']
      disabled?: boolean
      invalid?: boolean
      class?: string
    }>(),
    { granularity: 'minute', clearable: false, fixedWeeks: true },
  )
  const emit = defineEmits<{ clear: [] }>()

  const model = defineModel<string | null>({ default: null })
  const open = defineModel<boolean>('open', { default: false })

  const slots = useSlots()
  const t = useUiLocale()
  const outer = injectInputGroup()
  const host = shallowRef<HTMLElement | null>(null)

  const size = computed(() => (outer ? outer.size.value : props.size))
  const { invalid, disabled } = useFieldControl({
    invalid: () => props.invalid || !!outer?.invalid.value,
    disabled: () => props.disabled || !!outer?.disabled.value,
  })
  const calendarSize = computed<CalendarVariants['size']>(() => size.value ?? 'md')

  const parts = computed(() => splitDateTime(model.value))
  const fallbackTime = computed(
    () =>
      splitDateTime(props.placeholder).time ??
      (props.granularity === 'second' ? '00:00:00' : '00:00'),
  )
  const minDate = computed(() => splitDateTime(props.min).date ?? undefined)
  const maxDate = computed(() => splitDateTime(props.max).date ?? undefined)

  function pickDate(date: string | null) {
    model.value = joinDateTime(date, parts.value.time ?? fallbackTime.value)
  }

  function pickTime(time: string | null) {
    model.value = joinDateTime(parts.value.date, time)
  }

  function done() {
    open.value = false
  }
</script>

<template>
  <PopoverRoot v-model:open="open" modal>
    <PopoverAnchor as-child>
      <div
        ref="host"
        data-hn-date-time-picker
        :data-invalid="invalid ? '' : undefined"
        :data-disabled="disabled ? '' : undefined"
        :class="
          cn(
            outer ? inputEmbedded() : inputHost({ variant: props.variant, size: props.size }),
            props.class,
          )
        "
      >
        <InputGroupScope :size="size" :disabled="disabled" :invalid="invalid">
          <DateField
            v-bind="$attrs"
            :model-value="model"
            :placeholder="props.placeholder"
            :min="props.min"
            :max="props.max"
            :granularity="props.granularity"
            :hour-cycle="props.hourCycle"
            :clearable="props.clearable"
            :readonly="props.readonly"
            :name="props.name"
            @update:model-value="model = $event"
            @clear="emit('clear')"
          >
            <template v-if="slots.leading" #leading>
              <slot name="leading" />
            </template>
          </DateField>
        </InputGroupScope>
        <PopoverTrigger as-child>
          <InputAction :label="t.datePicker.open" :disabled="disabled">
            <CalendarClock />
          </InputAction>
        </PopoverTrigger>
      </div>
    </PopoverAnchor>
    <PopoverPortal>
      <PopoverContent
        as-child
        side="bottom"
        align="start"
        :side-offset="8"
        @open-auto-focus.prevent
      >
        <Card :padded="false" :class="datePickerContent()">
          <Calendar
            :model-value="parts.date"
            :placeholder="splitDateTime(props.placeholder).date ?? undefined"
            :min="minDate"
            :max="maxDate"
            :unavailable="props.unavailable"
            :week-starts-on="props.weekStartsOn"
            :weekday-format="props.weekdayFormat"
            :fixed-weeks="props.fixedWeeks"
            :size="calendarSize"
            :readonly="props.readonly"
            autofocus
            @update:model-value="pickDate"
          />
          <div :class="dateTimePickerFooter()">
            <TimeField
              :model-value="parts.time"
              :placeholder="fallbackTime"
              :granularity="props.granularity"
              :hour-cycle="props.hourCycle"
              :minute-step="props.minuteStep"
              :size="calendarSize"
              :readonly="props.readonly"
              :aria-label="t.dateTimePicker.time"
              @update:model-value="pickTime"
            />
            <Button :size="calendarSize" @click="done">{{ t.common.confirm }}</Button>
          </div>
        </Card>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
