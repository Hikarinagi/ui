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
import {
  getLocalTimeZone,
  isEqualDay,
  Time,
  toCalendarDateTime,
  today,
  type DateValue,
} from '@internationalized/date'
import {
  getDefaultTime,
  isBefore,
  type HourCycle,
  type TimeValue,
} from '../../../../shared/src/primitives/date/comparators'
import { createDateFormatter } from '../../../../shared/src/primitives/date/formatter'
import {
  createContent,
  initializeTimeSegmentValues,
  syncTimeSegmentValues,
  type SegmentValueObj,
} from '../../../../shared/src/primitives/date/parser'
import {
  getTimeFieldSegmentElements,
  isSegmentNavigationKey,
} from '../../../../shared/src/primitives/date/segment'
import {
  kbd,
  normalizeDateStep,
  normalizeHourCycle,
  type DateStep,
} from '../../../../shared/src/primitives/date/utils'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useDirection, type Direction } from '../utils/useDirection'
import { useLocale } from '../utils/useLocale'
import { usePrimitiveElement } from '../utils/usePrimitiveElement'
import { useVModel } from '../utils/useVModel'
import { VisuallyHidden } from '../visually-hidden'
import { provideTimeFieldRootContext } from './context'

export const TIME_FIELD_SEGMENT = 'data-reka-time-field-segment'

export interface TimeFieldRootProps {
  defaultValue?: TimeValue
  defaultPlaceholder?: TimeValue
  placeholder?: TimeValue
  modelValue?: TimeValue | null
  hourCycle?: HourCycle
  step?: DateStep
  stepSnapping?: boolean
  granularity?: 'hour' | 'minute' | 'second'
  hideTimeZone?: boolean
  maxValue?: TimeValue
  minValue?: TimeValue
  locale?: string
  disabled?: boolean
  readonly?: boolean
  id?: string
  dir?: Direction
  asChild?: boolean
  as?: PrimitiveProps['as']
  name?: string
  required?: boolean
}

export type TimeFieldRootEmits = {
  'update:modelValue': [date: TimeValue | undefined]
  'update:placeholder': [date: TimeValue]
}

function convertValue(value: TimeValue, date: DateValue = today(getLocalTimeZone())) {
  if (value && 'day' in value) return value
  return toCalendarDateTime(date, value)
}

export const TimeFieldRoot = defineComponent({
  name: 'TimeFieldRoot',
  inheritAttrs: false,
  props: {
    defaultValue: { type: Object as PropType<TimeValue>, required: false, default: undefined },
    defaultPlaceholder: { type: Object as PropType<TimeValue>, required: false },
    placeholder: { type: Object as PropType<TimeValue>, required: false, default: undefined },
    modelValue: { type: [Object, null] as PropType<TimeValue | null>, required: false },
    hourCycle: { type: null as unknown as PropType<HourCycle>, required: false },
    step: { type: Object as PropType<DateStep>, required: false },
    stepSnapping: { type: Boolean, required: false, default: false },
    granularity: { type: String as PropType<'hour' | 'minute' | 'second'>, required: false },
    hideTimeZone: { type: Boolean, required: false },
    maxValue: { type: Object as PropType<TimeValue>, required: false },
    minValue: { type: Object as PropType<TimeValue>, required: false },
    locale: { type: String, required: false },
    disabled: { type: Boolean, required: false, default: false },
    readonly: { type: Boolean, required: false, default: false },
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
      granularity,
      defaultValue,
      minValue,
      maxValue,
      stepSnapping,
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

    const step = computed(() => normalizeDateStep(props.step))

    const convertedMinValue = computed(() =>
      minValue.value ? convertValue(minValue.value) : undefined,
    )
    const convertedMaxValue = computed(() =>
      maxValue.value ? convertValue(maxValue.value) : undefined,
    )

    function collectSegments() {
      getTimeFieldSegmentElements(parentElement.value, TIME_FIELD_SEGMENT).forEach(item =>
        segmentElements.value.add(item),
      )
    }

    onMounted(collectSegments)

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: defaultValue.value,
      passive: props.modelValue === undefined,
    }) as Ref<TimeValue>

    const convertedModelValue = computed<DateValue | undefined>({
      get() {
        if (modelValue.value == null) return modelValue.value
        return convertValue(modelValue.value)
      },
      set(newValue) {
        if (newValue) {
          const next = newValue as DateValue & Time
          modelValue.value =
            modelValue.value && 'day' in modelValue.value
              ? next
              : new Time(next.hour, next.minute, next.second, modelValue.value?.millisecond)
        } else modelValue.value = newValue as unknown as TimeValue
      },
    })

    const defaultDate = getDefaultTime({
      defaultPlaceholder: props.placeholder,
      defaultValue: modelValue.value,
    })

    const placeholder = useVModel(props, 'placeholder', emit, {
      defaultValue: props.defaultPlaceholder ?? defaultDate.copy(),
      passive: props.placeholder === undefined,
    }) as Ref<TimeValue>

    const convertedPlaceholder = computed<DateValue>({
      get() {
        return convertValue(placeholder.value)
      },
      set(newValue) {
        if (newValue) {
          const next = newValue as DateValue & Time
          placeholder.value =
            'day' in placeholder.value
              ? (newValue.copy() as TimeValue)
              : new Time(next.hour, next.minute, next.second, placeholder.value?.millisecond)
        }
      },
    })

    const inferredGranularity = computed(() => granularity.value || 'minute')

    const isInvalid = computed(() => {
      if (!modelValue.value) return false
      if (convertedMinValue.value && isBefore(convertedModelValue.value!, convertedMinValue.value))
        return true
      if (convertedMaxValue.value && isBefore(convertedMaxValue.value, convertedModelValue.value!))
        return true
      return false
    })

    const initialSegments = initializeTimeSegmentValues(inferredGranularity.value)

    const segmentValues = ref<SegmentValueObj>(
      modelValue.value
        ? { ...syncTimeSegmentValues({ value: convertedModelValue.value!, formatter }) }
        : { ...initialSegments },
    )

    const allSegmentContent = computed(() =>
      createContent({
        granularity: inferredGranularity.value,
        dateRef: convertedPlaceholder.value,
        formatter,
        hideTimeZone: props.hideTimeZone,
        hourCycle: props.hourCycle,
        segmentValues: segmentValues.value,
        locale: locale.value,
        isTimeValue: true,
      }),
    )

    const segmentContents = computed(() => {
      const contents = allSegmentContent.value.arr
      if (props.hourCycle === 12)
        return contents.map(segment => {
          if (segment.part === 'hour' && 'hour' in segmentValues.value) {
            const hour = segmentValues.value.hour
            if (hour != null) {
              const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
              return { ...segment, value: displayHour.toString() }
            }
          }
          return segment
        })
      return contents
    })

    const editableSegmentContents = computed(() =>
      segmentContents.value.filter(({ part }) => part !== 'literal'),
    )

    watch(locale, value => {
      if (formatter.getLocale() !== value) {
        formatter.setLocale(value)
        void nextTick(() => {
          segmentElements.value.clear()
          collectSegments()
        })
      }
    })

    watch(convertedModelValue, value => {
      if (
        value != null &&
        (!isEqualDay(convertedPlaceholder.value, value) ||
          convertedPlaceholder.value.compare(value) !== 0)
      )
        placeholder.value = value.copy() as TimeValue
    })

    watch([convertedModelValue, locale], ([value]) => {
      if (value != null) segmentValues.value = { ...syncTimeSegmentValues({ value, formatter }) }
      else if (Object.values(segmentValues.value).every(item => item !== null) && value == null)
        segmentValues.value = { ...initialSegments }
    })

    const currentFocusedElement = ref<HTMLElement | null>(null)

    const currentSegmentIndex = computed(() =>
      Array.from(segmentElements.value).findIndex(
        element =>
          element.getAttribute(TIME_FIELD_SEGMENT) ===
          currentFocusedElement.value?.getAttribute(TIME_FIELD_SEGMENT),
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

    provideTimeFieldRootContext({
      locale,
      modelValue: convertedModelValue,
      placeholder: convertedPlaceholder,
      disabled,
      formatter,
      hourCycle: props.hourCycle,
      step,
      stepSnapping,
      readonly,
      segmentValues,
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
              value: modelValue.value ? modelValue.value.toString() : '',
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
