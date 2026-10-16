import {
  computed,
  defineComponent,
  h,
  mergeProps,
  nextTick,
  onMounted,
  ref,
  renderSlot,
  toRefs,
  watch,
  withCtx,
  withKeys,
  type PropType,
  type Ref,
} from 'vue'
import type { DateValue } from '@internationalized/date'
import {
  areAllDaysBetweenValid,
  getDefaultDate,
  hasTime,
  isBefore,
  isBeforeOrSame,
  type Granularity,
  type HourCycle,
} from '../../../../shared/src/primitives/date/comparators'
import { createDateFormatter } from '../../../../shared/src/primitives/date/formatter'
import {
  createContent,
  initializeSegmentValues,
  syncSegmentValues,
  type SegmentValueObj,
} from '../../../../shared/src/primitives/date/parser'
import {
  getSegmentElements,
  isSegmentNavigationKey,
} from '../../../../shared/src/primitives/date/segment'
import {
  kbd,
  normalizeDateStep,
  normalizeHourCycle,
  type DateStep,
} from '../../../../shared/src/primitives/date/utils'
import { DATE_FIELD_SEGMENT } from '../date-field/DateFieldRoot'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useDirection, type Direction } from '../utils/useDirection'
import { useLocale } from '../utils/useLocale'
import { usePrimitiveElement } from '../utils/usePrimitiveElement'
import { useVModel } from '../utils/useVModel'
import { VisuallyHidden } from '../visually-hidden'
import { provideDateRangeFieldRootContext, type DateRange } from './context'
import { DATE_RANGE_FIELD_SEGMENT_TYPE } from './DateRangeFieldInput'

export interface DateRangeFieldRootProps {
  defaultValue?: DateRange
  defaultPlaceholder?: DateValue
  placeholder?: DateValue
  modelValue?: DateRange | null
  hourCycle?: HourCycle
  step?: DateStep
  granularity?: Granularity
  hideTimeZone?: boolean
  maxValue?: DateValue
  minValue?: DateValue
  locale?: string
  disabled?: boolean
  readonly?: boolean
  isDateUnavailable?: (date: DateValue) => boolean
  id?: string
  dir?: Direction
  asChild?: boolean
  as?: PrimitiveProps['as']
  name?: string
  required?: boolean
}

export type DateRangeFieldRootEmits = {
  'update:modelValue': [value: DateRange]
  'update:placeholder': [date: DateValue]
}

export const DateRangeFieldRoot = defineComponent({
  name: 'DateRangeFieldRoot',
  inheritAttrs: false,
  props: {
    defaultValue: { type: Object as PropType<DateRange>, required: false, default: undefined },
    defaultPlaceholder: { type: null as unknown as PropType<DateValue>, required: false },
    placeholder: {
      type: null as unknown as PropType<DateValue>,
      required: false,
      default: undefined,
    },
    modelValue: { type: [Object, null] as PropType<DateRange | null>, required: false },
    hourCycle: { type: null as unknown as PropType<HourCycle>, required: false },
    step: { type: Object as PropType<DateStep>, required: false },
    granularity: { type: String as PropType<Granularity>, required: false },
    hideTimeZone: { type: Boolean, required: false },
    maxValue: { type: null as unknown as PropType<DateValue>, required: false },
    minValue: { type: null as unknown as PropType<DateValue>, required: false },
    locale: { type: String, required: false },
    disabled: { type: Boolean, required: false, default: false },
    readonly: { type: Boolean, required: false, default: false },
    isDateUnavailable: {
      type: Function as PropType<(date: DateValue) => boolean>,
      required: false,
      default: undefined,
    },
    id: { type: String, required: false },
    dir: { type: String as PropType<Direction>, required: false },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
    name: { type: String, required: false },
    required: { type: Boolean, required: false },
  },
  emits: ['update:modelValue', 'update:placeholder'],
  setup(props, { emit, expose, slots, attrs }) {
    const {
      disabled,
      readonly,
      isDateUnavailable: propsIsDateUnavailable,
      dir: propDir,
      locale: propLocale,
    } = toRefs(props)
    const locale = useLocale(propLocale)
    const dir = useDirection(propDir)

    const formatter = createDateFormatter(locale.value, {
      hourCycle: normalizeHourCycle(props.hourCycle),
    })
    const { primitiveElement, currentElement: parentElement } = usePrimitiveElement()
    const segmentElements = ref<Set<HTMLElement>>(new Set())

    function collectSegments() {
      getSegmentElements(parentElement.value, DATE_FIELD_SEGMENT).forEach(item =>
        segmentElements.value.add(item),
      )
    }

    onMounted(collectSegments)

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: props.defaultValue ?? { start: undefined, end: undefined },
      passive: props.modelValue === undefined,
    }) as Ref<DateRange | null>

    const defaultDate = getDefaultDate({
      defaultPlaceholder: props.placeholder,
      granularity: props.granularity,
      defaultValue: modelValue.value?.start,
      locale: props.locale,
    })

    const placeholder = useVModel(props, 'placeholder', emit, {
      defaultValue: props.defaultPlaceholder ?? defaultDate.copy(),
      passive: props.placeholder === undefined,
    }) as Ref<DateValue>

    const step = computed(() => normalizeDateStep(props.step))

    const inferredGranularity = computed<Granularity>(() => {
      if (props.granularity) return !hasTime(placeholder.value) ? 'day' : props.granularity
      return hasTime(placeholder.value) ? 'minute' : 'day'
    })

    function isDateInvalid(date: DateValue | undefined) {
      if (!date) return false
      if (propsIsDateUnavailable.value?.(date)) return true
      if (props.minValue && isBefore(date, props.minValue)) return true
      if (props.maxValue && isBefore(props.maxValue, date)) return true
      return false
    }

    const isStartInvalid = computed(() => isDateInvalid(modelValue.value?.start))
    const isEndInvalid = computed(() => isDateInvalid(modelValue.value?.end))

    const isInvalid = computed(() => {
      if (isStartInvalid.value || isEndInvalid.value) return true
      if (!modelValue.value?.start || !modelValue.value?.end) return false
      if (!isBeforeOrSame(modelValue.value.start, modelValue.value.end)) return true
      if (propsIsDateUnavailable.value !== undefined) {
        const allValid = areAllDaysBetweenValid(
          modelValue.value.start,
          modelValue.value.end,
          propsIsDateUnavailable.value,
          undefined,
        )
        if (!allValid) return true
      }
      return false
    })

    const initialSegments = initializeSegmentValues(inferredGranularity.value)

    const startSegmentValues = ref<SegmentValueObj>(
      modelValue.value?.start
        ? { ...syncSegmentValues({ value: modelValue.value.start, formatter }) }
        : { ...initialSegments },
    )
    const endSegmentValues = ref<SegmentValueObj>(
      modelValue.value?.end
        ? { ...syncSegmentValues({ value: modelValue.value.end, formatter }) }
        : { ...initialSegments },
    )

    function segmentContent(values: SegmentValueObj) {
      return createContent({
        granularity: inferredGranularity.value,
        dateRef: placeholder.value,
        formatter,
        hideTimeZone: props.hideTimeZone,
        hourCycle: props.hourCycle,
        segmentValues: values,
        locale: locale.value,
      })
    }

    const startSegmentContent = computed(() => segmentContent(startSegmentValues.value))
    const endSegmentContent = computed(() => segmentContent(endSegmentValues.value))

    const segmentContents = computed(() => ({
      start: startSegmentContent.value.arr,
      end: endSegmentContent.value.arr,
    }))

    const editableSegmentContents = computed(() => ({
      start: segmentContents.value.start.filter(({ part }) => part !== 'literal'),
      end: segmentContents.value.end.filter(({ part }) => part !== 'literal'),
    }))

    const startValue = ref(modelValue.value?.start?.copy()) as Ref<DateValue | undefined>
    const endValue = ref(modelValue.value?.end?.copy()) as Ref<DateValue | undefined>

    watch([startValue, endValue], ([start, end]) => {
      modelValue.value = { start: start?.copy(), end: end?.copy() }
    })

    watch(modelValue, value => {
      const isStartChanged =
        value?.start && startValue.value
          ? value.start.compare(startValue.value) !== 0
          : value?.start !== startValue.value
      if (isStartChanged) startValue.value = value?.start?.copy()
      const isEndChanged =
        value?.end && endValue.value
          ? value.end.compare(endValue.value) !== 0
          : value?.end !== endValue.value
      if (isEndChanged) endValue.value = value?.end?.copy()
    })

    watch([startValue, locale], ([start]) => {
      if (start !== undefined)
        startSegmentValues.value = { ...syncSegmentValues({ value: start, formatter }) }
      else if (
        Object.values(startSegmentValues.value).every(item => item !== null) &&
        start === undefined
      )
        startSegmentValues.value = { ...initialSegments }
    })

    watch(locale, value => {
      if (formatter.getLocale() !== value) {
        formatter.setLocale(value)
        void nextTick(() => {
          segmentElements.value.clear()
          collectSegments()
        })
      }
    })

    watch(modelValue, value => {
      if (value && value.start !== undefined && placeholder.value.compare(value.start) !== 0)
        placeholder.value = value.start.copy()
    })

    watch([endValue, locale], ([end]) => {
      if (end !== undefined)
        endSegmentValues.value = { ...syncSegmentValues({ value: end, formatter }) }
      else if (
        Object.values(endSegmentValues.value).every(item => item !== null) &&
        end === undefined
      )
        endSegmentValues.value = { ...initialSegments }
    })

    const currentFocusedElement = ref<HTMLElement | null>(null)

    const currentSegmentIndex = computed(() =>
      Array.from(segmentElements.value).findIndex(
        element =>
          element.getAttribute(DATE_FIELD_SEGMENT) ===
            currentFocusedElement.value?.getAttribute(DATE_FIELD_SEGMENT) &&
          element.getAttribute(DATE_RANGE_FIELD_SEGMENT_TYPE) ===
            currentFocusedElement.value?.getAttribute(DATE_RANGE_FIELD_SEGMENT_TYPE),
      ),
    )

    const nextFocusableSegment = computed(() => {
      const sign = dir.value === 'rtl' ? -1 : 1
      const nextCondition =
        sign < 0
          ? currentSegmentIndex.value < 0
          : currentSegmentIndex.value > segmentElements.value.size - 1
      if (nextCondition) return null
      return Array.from(segmentElements.value)[currentSegmentIndex.value + sign]
    })

    const prevFocusableSegment = computed(() => {
      const sign = dir.value === 'rtl' ? -1 : 1
      const prevCondition =
        sign > 0
          ? currentSegmentIndex.value < 0
          : currentSegmentIndex.value > segmentElements.value.size - 1
      if (prevCondition) return null
      return Array.from(segmentElements.value)[currentSegmentIndex.value - sign]
    })

    function handleKeydown(event: KeyboardEvent) {
      if (event.isComposing) return
      if (!isSegmentNavigationKey(event.key)) return
      if (event.key === kbd.ARROW_LEFT) prevFocusableSegment.value?.focus()
      if (event.key === kbd.ARROW_RIGHT) nextFocusableSegment.value?.focus()
    }

    function setFocusedElement(element: HTMLElement) {
      currentFocusedElement.value = element
    }

    provideDateRangeFieldRootContext({
      isDateUnavailable: propsIsDateUnavailable.value,
      locale,
      startValue,
      endValue,
      placeholder,
      disabled,
      formatter,
      hourCycle: props.hourCycle,
      step,
      readonly,
      segmentValues: { start: startSegmentValues, end: endSegmentValues },
      isInvalid,
      segmentContents: editableSegmentContents,
      elements: segmentElements,
      setFocusedElement,
      focusNext() {
        Array.from(segmentElements.value)[currentSegmentIndex.value + 1]?.focus()
      },
    })

    expose({ setFocusedElement })

    const onKeydown = withKeys(handleKeydown as (event: Event) => void, ['left', 'right'])
    const focusFirst = () => Array.from(segmentElements.value)?.[0]?.focus()

    return () =>
      h(
        Primitive,
        mergeProps(attrs, {
          ref: primitiveElement,
          role: 'group',
          'aria-disabled': disabled.value ? true : undefined,
          'data-disabled': disabled.value ? '' : undefined,
          'data-readonly': readonly.value ? '' : undefined,
          'data-invalid': isInvalid.value ? '' : undefined,
          dir: dir.value,
          onKeydown,
        }),
        {
          default: withCtx(() => [
            renderSlot(slots, 'default', {
              modelValue: modelValue.value,
              segments: segmentContents.value,
              isInvalid: isInvalid.value,
            }),
            h(VisuallyHidden, {
              id: props.id,
              as: 'input',
              feature: 'focusable',
              tabindex: '-1',
              value: `${modelValue.value?.start?.toString()} - ${modelValue.value?.end?.toString()}`,
              name: props.name,
              disabled: disabled.value,
              required: props.required,
              onFocus: focusFirst,
            }),
          ]),
        },
      )
  },
})
