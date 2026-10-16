import {
  computed,
  defineComponent,
  h,
  onMounted,
  renderSlot,
  toDisplayString,
  toRefs,
  watch,
  withCtx,
  type PropType,
  type Ref,
} from 'vue'
import { isEqualDay, isSameDay, type DateValue } from '@internationalized/date'
import { getWeekStartsOn } from '../../../../shared/src/primitives/date/calendar'
import type {
  Matcher,
  PageFunction,
  WeekDayFormat,
} from '../../../../shared/src/primitives/date/calendar-view'
import { getDefaultDate } from '../../../../shared/src/primitives/date/comparators'
import { handleCalendarInitialFocus } from '../../../../shared/src/primitives/date/utils'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useDirection, type Direction } from '../utils/useDirection'
import { useLocale } from '../utils/useLocale'
import { usePrimitiveElement } from '../utils/usePrimitiveElement'
import { useVModel } from '../utils/useVModel'
import { provideCalendarRootContext } from './context'
import { useCalendar, useCalendarState } from './useCalendar'

export const VISUALLY_HIDDEN_HEADING_STYLE = {
  border: '0px',
  clip: 'rect(0px, 0px, 0px, 0px)',
  'clip-path': 'inset(50%)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: '0px',
  position: 'absolute',
  'white-space': 'nowrap',
  width: '1px',
}

export interface CalendarRootProps {
  defaultValue?: DateValue
  defaultPlaceholder?: DateValue
  placeholder?: DateValue
  pagedNavigation?: boolean
  preventDeselect?: boolean
  weekStartsOn?: number
  weekdayFormat?: WeekDayFormat
  calendarLabel?: string
  fixedWeeks?: boolean
  maxValue?: DateValue
  minValue?: DateValue
  locale?: string
  numberOfMonths?: number
  disabled?: boolean
  readonly?: boolean
  initialFocus?: boolean
  isDateDisabled?: Matcher
  isDateUnavailable?: Matcher
  dir?: Direction
  nextPage?: PageFunction
  prevPage?: PageFunction
  modelValue?: DateValue | DateValue[] | undefined
  multiple?: boolean
  disableDaysOutsideCurrentView?: boolean
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export type CalendarRootEmits = {
  'update:modelValue': [date: DateValue | undefined]
  'update:placeholder': [date: DateValue]
}

export const CalendarRoot = defineComponent({
  name: 'CalendarRoot',
  props: {
    defaultValue: {
      type: null as unknown as PropType<DateValue>,
      required: false,
      default: undefined,
    },
    defaultPlaceholder: { type: null as unknown as PropType<DateValue>, required: false },
    placeholder: {
      type: null as unknown as PropType<DateValue>,
      required: false,
      default: undefined,
    },
    pagedNavigation: { type: Boolean, required: false, default: false },
    preventDeselect: { type: Boolean, required: false, default: false },
    weekStartsOn: { type: Number, required: false },
    weekdayFormat: { type: String as PropType<WeekDayFormat>, required: false, default: 'narrow' },
    calendarLabel: { type: String, required: false },
    fixedWeeks: { type: Boolean, required: false, default: false },
    maxValue: { type: null as unknown as PropType<DateValue>, required: false },
    minValue: { type: null as unknown as PropType<DateValue>, required: false },
    locale: { type: String, required: false },
    numberOfMonths: { type: Number, required: false, default: 1 },
    disabled: { type: Boolean, required: false, default: false },
    readonly: { type: Boolean, required: false, default: false },
    initialFocus: { type: Boolean, required: false, default: false },
    isDateDisabled: { type: Function as PropType<Matcher>, required: false, default: undefined },
    isDateUnavailable: { type: Function as PropType<Matcher>, required: false, default: undefined },
    dir: { type: String as PropType<Direction>, required: false },
    nextPage: { type: Function as PropType<PageFunction>, required: false },
    prevPage: { type: Function as PropType<PageFunction>, required: false },
    modelValue: {
      type: null as unknown as PropType<DateValue | DateValue[] | undefined>,
      required: false,
    },
    multiple: { type: Boolean, required: false, default: false },
    disableDaysOutsideCurrentView: { type: Boolean, required: false, default: false },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'div',
    },
  },
  emits: ['update:modelValue', 'update:placeholder'],
  setup(props, { emit, slots }) {
    const {
      disabled,
      readonly,
      initialFocus,
      pagedNavigation,
      weekdayFormat,
      fixedWeeks,
      multiple,
      minValue,
      maxValue,
      numberOfMonths,
      preventDeselect,
      isDateDisabled: propsIsDateDisabled,
      isDateUnavailable: propsIsDateUnavailable,
      calendarLabel,
      defaultValue,
      nextPage: propsNextPage,
      prevPage: propsPrevPage,
      dir: propDir,
      locale: propLocale,
      disableDaysOutsideCurrentView,
    } = toRefs(props)

    const { primitiveElement, currentElement: parentElement } = usePrimitiveElement()
    const locale = useLocale(propLocale)
    const dir = useDirection(propDir)
    const weekStartsOn = computed(() => props.weekStartsOn ?? getWeekStartsOn(locale.value))

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: defaultValue.value,
      passive: props.modelValue === undefined,
    }) as Ref<DateValue | DateValue[] | undefined>

    const defaultDate = getDefaultDate({
      defaultPlaceholder: props.placeholder,
      defaultValue: modelValue.value,
      locale: props.locale,
    })

    const placeholder = useVModel(props, 'placeholder', emit, {
      defaultValue: props.defaultPlaceholder ?? defaultDate.copy(),
      passive: props.placeholder === undefined,
    }) as Ref<DateValue>

    function onPlaceholderChange(value: DateValue) {
      placeholder.value = value.copy()
    }

    const {
      fullCalendarLabel,
      headingValue,
      isDateDisabled,
      isDateUnavailable,
      isNextButtonDisabled,
      isPrevButtonDisabled,
      weekdays,
      isOutsideVisibleView,
      nextPage,
      prevPage,
      formatter,
      grid,
      isPlaceholderFocusable,
      firstFocusableDate,
    } = useCalendar({
      locale,
      placeholder,
      weekStartsOn,
      fixedWeeks,
      numberOfMonths,
      minValue,
      maxValue,
      disabled,
      weekdayFormat,
      pagedNavigation,
      isDateDisabled: propsIsDateDisabled.value,
      isDateUnavailable: propsIsDateUnavailable.value,
      calendarLabel,
      nextPage: propsNextPage,
      prevPage: propsPrevPage,
    })

    const { isInvalid, isDateSelected, hasSelectedDate, isSelectedDateDisabled } = useCalendarState(
      { date: modelValue, isDateDisabled, isDateUnavailable },
    )

    watch(modelValue, value => {
      if (Array.isArray(value) && value.length) {
        const lastValue = value.at(-1)
        if (lastValue && !isEqualDay(placeholder.value, lastValue)) onPlaceholderChange(lastValue)
      } else if (!Array.isArray(value) && value && !isEqualDay(placeholder.value, value))
        onPlaceholderChange(value)
    })

    function onDateChange(value: DateValue) {
      if (!multiple.value) {
        if (!modelValue.value) {
          modelValue.value = value.copy()
          return
        }
        if (!preventDeselect.value && isEqualDay(modelValue.value as DateValue, value)) {
          placeholder.value = value.copy()
          modelValue.value = undefined
        } else modelValue.value = value.copy()
      } else if (!modelValue.value) modelValue.value = [value.copy()]
      else if (Array.isArray(modelValue.value)) {
        const index = modelValue.value.findIndex(date => isSameDay(date, value))
        if (index === -1) modelValue.value = [...modelValue.value, value]
        else if (!preventDeselect.value) {
          const next = modelValue.value.filter(date => !isSameDay(date, value))
          if (!next.length) {
            placeholder.value = value.copy()
            modelValue.value = undefined
            return
          }
          modelValue.value = next.map(date => date.copy())
        }
      }
    }

    onMounted(() => {
      if (initialFocus.value) handleCalendarInitialFocus(parentElement.value ?? null)
    })

    provideCalendarRootContext({
      isDateUnavailable,
      dir,
      isDateDisabled,
      locale,
      formatter,
      modelValue,
      placeholder,
      disabled,
      initialFocus,
      pagedNavigation,
      grid,
      weekDays: weekdays,
      weekStartsOn,
      weekdayFormat,
      fixedWeeks,
      multiple,
      numberOfMonths,
      readonly,
      preventDeselect,
      fullCalendarLabel,
      headingValue,
      isInvalid,
      isDateSelected,
      isNextButtonDisabled,
      isPrevButtonDisabled,
      isOutsideVisibleView,
      nextPage,
      prevPage,
      parentElement,
      onPlaceholderChange,
      onDateChange,
      disableDaysOutsideCurrentView,
      minValue,
      maxValue,
      isPlaceholderFocusable,
      firstFocusableDate,
      hasSelectedDate,
      isSelectedDateDisabled,
    })

    return () =>
      h(
        Primitive,
        {
          ref: primitiveElement,
          as: props.as,
          'as-child': props.asChild,
          'aria-label': fullCalendarLabel.value,
          'data-readonly': readonly.value ? '' : undefined,
          'data-disabled': disabled.value ? '' : undefined,
          'data-invalid': isInvalid.value ? '' : undefined,
          dir: dir.value,
        },
        {
          default: withCtx(() => [
            renderSlot(slots, 'default', {
              date: placeholder.value,
              grid: grid.value,
              weekDays: weekdays.value,
              weekStartsOn: weekStartsOn.value,
              locale: locale.value,
              fixedWeeks: fixedWeeks.value,
              modelValue: modelValue.value,
            }),
            h('div', { style: VISUALLY_HIDDEN_HEADING_STYLE }, [
              h(
                'div',
                { role: 'heading', 'aria-level': '2' },
                toDisplayString(fullCalendarLabel.value),
              ),
            ]),
          ]),
        },
      )
  },
})
