import {
  computed,
  defineComponent,
  h,
  onMounted,
  ref,
  renderSlot,
  toDisplayString,
  toRefs,
  watch,
  withCtx,
  type PropType,
  type Ref,
} from 'vue'
import { useEventListener } from '@vueuse/core'
import { isEqualDay, isSameDay, type DateValue } from '@internationalized/date'
import { getWeekStartsOn } from '../../../../shared/src/primitives/date/calendar'
import type {
  Matcher,
  PageFunction,
  WeekDayFormat,
} from '../../../../shared/src/primitives/date/calendar-view'
import { getDefaultDate, isBefore } from '../../../../shared/src/primitives/date/comparators'
import {
  highlightedCalendarRange,
  isRangeDateDisabled,
  isRangeDateSelected,
  isRangeInvalid,
  rangeSelectionFocus,
  type CalendarRange,
  type FixedDate,
} from '../../../../shared/src/primitives/date/range-calendar-view'
import { handleCalendarInitialFocus, kbd } from '../../../../shared/src/primitives/date/utils'
import { VISUALLY_HIDDEN_HEADING_STYLE } from '../calendar/CalendarRoot'
import { useCalendar } from '../calendar/useCalendar'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useDirection, type Direction } from '../utils/useDirection'
import { useLocale } from '../utils/useLocale'
import { usePrimitiveElement } from '../utils/usePrimitiveElement'
import { useVModel } from '../utils/useVModel'
import { provideRangeCalendarRootContext } from './context'

export interface RangeCalendarRootProps {
  defaultPlaceholder?: DateValue
  defaultValue?: CalendarRange
  modelValue?: CalendarRange | null
  placeholder?: DateValue
  allowNonContiguousRanges?: boolean
  pagedNavigation?: boolean
  preventDeselect?: boolean
  maximumDays?: number
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
  isDateHighlightable?: Matcher
  dir?: Direction
  nextPage?: PageFunction
  prevPage?: PageFunction
  disableDaysOutsideCurrentView?: boolean
  fixedDate?: FixedDate
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export type RangeCalendarRootEmits = {
  'update:modelValue': [date: CalendarRange]
  'update:validModelValue': [date: CalendarRange]
  'update:placeholder': [date: DateValue]
  'update:startValue': [date: DateValue | undefined]
}

const normalizeRange = (value?: CalendarRange | null): CalendarRange =>
  value ?? { start: undefined, end: undefined }

export const RangeCalendarRoot = defineComponent({
  name: 'RangeCalendarRoot',
  props: {
    defaultPlaceholder: { type: null as unknown as PropType<DateValue>, required: false },
    defaultValue: {
      type: Object as PropType<CalendarRange>,
      required: false,
      default: () => ({ start: undefined, end: undefined }),
    },
    modelValue: { type: [Object, null] as PropType<CalendarRange | null>, required: false },
    placeholder: {
      type: null as unknown as PropType<DateValue>,
      required: false,
      default: undefined,
    },
    allowNonContiguousRanges: { type: Boolean, required: false, default: false },
    pagedNavigation: { type: Boolean, required: false, default: false },
    preventDeselect: { type: Boolean, required: false, default: false },
    maximumDays: { type: Number, required: false, default: undefined },
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
    isDateHighlightable: {
      type: Function as PropType<Matcher>,
      required: false,
      default: undefined,
    },
    dir: { type: String as PropType<Direction>, required: false },
    nextPage: { type: Function as PropType<PageFunction>, required: false },
    prevPage: { type: Function as PropType<PageFunction>, required: false },
    disableDaysOutsideCurrentView: { type: Boolean, required: false, default: false },
    fixedDate: { type: String as PropType<FixedDate>, required: false },
    asChild: { type: Boolean, required: false },
    as: {
      type: null as unknown as PropType<PrimitiveProps['as']>,
      required: false,
      default: 'div',
    },
  },
  emits: ['update:modelValue', 'update:validModelValue', 'update:placeholder', 'update:startValue'],
  setup(props, { emit, slots }) {
    const {
      disabled,
      readonly,
      initialFocus,
      pagedNavigation,
      weekdayFormat,
      fixedWeeks,
      numberOfMonths,
      preventDeselect,
      isDateUnavailable: propsIsDateUnavailable,
      isDateHighlightable: propsIsDateHighlightable,
      isDateDisabled: propsIsDateDisabled,
      calendarLabel,
      maxValue,
      minValue,
      dir: propDir,
      locale: propLocale,
      nextPage: propsNextPage,
      prevPage: propsPrevPage,
      allowNonContiguousRanges,
      disableDaysOutsideCurrentView,
      fixedDate,
      maximumDays,
    } = toRefs(props)

    const { primitiveElement, currentElement: parentElement } = usePrimitiveElement()
    const dir = useDirection(propDir)
    const locale = useLocale(propLocale)
    const weekStartsOn = computed(() => props.weekStartsOn ?? getWeekStartsOn(locale.value))

    const lastPressedDateValue = ref() as Ref<DateValue | undefined>
    const focusedValue = ref() as Ref<DateValue | undefined>
    const isEditing = ref(false)

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? { start: undefined, end: undefined },
      passive: props.modelValue === undefined,
    }) as Ref<CalendarRange | null>

    const normalizedModelValue = computed(() => normalizeRange(modelValue.value))
    const validModelValue = ref(normalizeRange(modelValue.value)) as Ref<CalendarRange>

    watch(validModelValue, value => emit('update:validModelValue', value))

    const defaultDate = getDefaultDate({
      defaultPlaceholder: props.placeholder,
      defaultValue: normalizeRange(modelValue.value).start,
      locale: props.locale,
    })

    const startValue = ref(normalizeRange(modelValue.value).start) as Ref<DateValue | undefined>
    const endValue = ref(normalizeRange(modelValue.value).end) as Ref<DateValue | undefined>

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
      grid,
      weekdays,
      isOutsideVisibleView,
      nextPage,
      prevPage,
      formatter,
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

    const range = () => ({ start: startValue.value, end: endValue.value })
    const isInvalid = computed(() => isRangeInvalid(range(), isDateDisabled))
    const isSelected = (date: DateValue) => isRangeDateSelected(range(), date)
    const isSelectionStart = (date: DateValue) =>
      !!startValue.value && isSameDay(startValue.value, date)
    const isSelectionEnd = (date: DateValue) => !!endValue.value && isSameDay(endValue.value, date)
    const rangeIsDateDisabled = (date: DateValue) =>
      isRangeDateDisabled(
        date,
        {
          start: startValue.value,
          end: endValue.value,
          fixedDate: fixedDate.value,
          maximumDays: maximumDays.value,
        },
        isDateDisabled,
      )
    const isDateHighlightable = (date: DateValue) => !!propsIsDateHighlightable.value?.(date)
    const highlightedRange = computed(() =>
      highlightedCalendarRange({
        start: startValue.value,
        end: endValue.value,
        focused: focusedValue.value,
        fixedDate: fixedDate.value,
        maximumDays: maximumDays.value,
        allowNonContiguousRanges: allowNonContiguousRanges.value,
        isDateUnavailable,
        isDateDisabled: rangeIsDateDisabled,
        isDateHighlightable: propsIsDateHighlightable.value,
      }),
    )
    const isHighlightedStart = (date: DateValue) =>
      !!highlightedRange.value?.start && isSameDay(highlightedRange.value.start, date)
    const isHighlightedEnd = (date: DateValue) =>
      !!highlightedRange.value?.end && isSameDay(highlightedRange.value.end, date)
    const selection = computed(() => rangeSelectionFocus(range(), isDateDisabled))
    const hasSelectedDate = computed(() => selection.value.hasSelectedDate)
    const isSelectedDisabled = computed(() => selection.value.isSelectedDisabled)
    const selectedFocusableDate = computed(() => selection.value.selectedFocusableDate)

    watch(modelValue, value => {
      const next = normalizeRange(value)
      const isStartSynced =
        (!next.start && !startValue.value) ||
        (!!next.start && !!startValue.value && isEqualDay(next.start, startValue.value))
      if (!isStartSynced) startValue.value = next.start?.copy?.()
      const isEndSynced =
        (!next.end && !endValue.value) ||
        (!!next.end && !!endValue.value && isEqualDay(next.end, endValue.value))
      if (!isEndSynced) endValue.value = next.end?.copy?.()
    })

    watch(startValue, value => {
      if (value && !isEqualDay(value, placeholder.value)) onPlaceholderChange(value)
      emit('update:startValue', value)
    })

    watch([startValue, endValue], ([start, end]) => {
      const value = modelValue.value
      if (
        value &&
        value.start &&
        value.end &&
        start &&
        end &&
        isEqualDay(value.start, start) &&
        isEqualDay(value.end, end)
      )
        return
      isEditing.value = true
      if (end && start) {
        const nextValue = isBefore(end, start)
          ? { start: end.copy(), end: start.copy() }
          : { start: start.copy(), end: end.copy() }
        modelValue.value = { start: nextValue.start, end: nextValue.end }
        isEditing.value = false
        validModelValue.value = { start: nextValue.start.copy(), end: nextValue.end.copy() }
      } else
        modelValue.value = start
          ? { start: start.copy(), end: undefined }
          : { start: end?.copy(), end: undefined }
    })

    useEventListener(parentElement, 'keydown', (event: KeyboardEvent) => {
      if (event.key === kbd.ESCAPE && isEditing.value) {
        startValue.value = validModelValue.value.start?.copy()
        endValue.value = validModelValue.value.end?.copy()
      }
    })

    provideRangeCalendarRootContext({
      isDateUnavailable,
      isDateHighlightable,
      startValue,
      endValue,
      formatter,
      modelValue: normalizedModelValue,
      placeholder,
      disabled,
      initialFocus,
      pagedNavigation,
      grid,
      weekDays: weekdays,
      weekStartsOn,
      weekdayFormat,
      fixedWeeks,
      numberOfMonths,
      readonly,
      preventDeselect,
      fullCalendarLabel,
      headingValue,
      isInvalid,
      isDateDisabled: rangeIsDateDisabled,
      allowNonContiguousRanges,
      highlightedRange,
      focusedValue,
      lastPressedDateValue,
      isSelected,
      isSelectionEnd,
      isSelectionStart,
      isNextButtonDisabled,
      isPrevButtonDisabled,
      isOutsideVisibleView,
      nextPage,
      prevPage,
      parentElement,
      onPlaceholderChange,
      locale,
      dir,
      isHighlightedStart,
      isHighlightedEnd,
      disableDaysOutsideCurrentView,
      fixedDate,
      maximumDays,
      minValue,
      maxValue,
      isPlaceholderFocusable,
      firstFocusableDate,
      hasSelectedDate,
      isSelectedDisabled,
      selectedFocusableDate,
    })

    onMounted(() => {
      if (initialFocus.value) handleCalendarInitialFocus(parentElement.value ?? null)
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
            h('div', { style: VISUALLY_HIDDEN_HEADING_STYLE }, [
              h(
                'div',
                { role: 'heading', 'aria-level': '2' },
                toDisplayString(fullCalendarLabel.value),
              ),
            ]),
            renderSlot(slots, 'default', {
              date: placeholder.value,
              grid: grid.value,
              weekDays: weekdays.value,
              weekStartsOn: weekStartsOn.value,
              locale: locale.value,
              fixedWeeks: fixedWeeks.value,
              modelValue: normalizedModelValue.value,
            }),
          ]),
        },
      )
  },
})
