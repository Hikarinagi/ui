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
  getDefaultDate,
  hasTime,
  isBefore,
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
  getInputType,
  kbd,
  normalizeDateStep,
  normalizeHourCycle,
  normalizeInputValue,
  type DateStep,
} from '../../../../shared/src/primitives/date/utils'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useDirection, type Direction } from '../utils/useDirection'
import { useLocale } from '../utils/useLocale'
import { usePrimitiveElement } from '../utils/usePrimitiveElement'
import { useVModel } from '../utils/useVModel'
import { VisuallyHidden } from '../visually-hidden'
import { provideDateFieldRootContext } from './context'

export const DATE_FIELD_SEGMENT = 'data-reka-date-field-segment'

export interface DateFieldRootProps {
  defaultValue?: DateValue
  defaultPlaceholder?: DateValue
  placeholder?: DateValue
  modelValue?: DateValue | null
  hourCycle?: HourCycle
  step?: DateStep
  stepSnapping?: boolean
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

export type DateFieldRootEmits = {
  'update:modelValue': [date: DateValue | undefined]
  'update:placeholder': [date: DateValue]
}

export const DateFieldRoot = defineComponent({
  name: 'DateFieldRoot',
  inheritAttrs: false,
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
    modelValue: { type: null as unknown as PropType<DateValue | null>, required: false },
    hourCycle: { type: null as unknown as PropType<HourCycle>, required: false },
    step: { type: Object as PropType<DateStep>, required: false },
    stepSnapping: { type: Boolean, required: false, default: false },
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
      granularity,
      defaultValue,
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

    function collectSegments() {
      getSegmentElements(parentElement.value, DATE_FIELD_SEGMENT).forEach(item =>
        segmentElements.value.add(item),
      )
    }

    onMounted(collectSegments)

    const modelValue = useVModel(props, 'modelValue', emit, {
      defaultValue: defaultValue.value,
      passive: props.modelValue === undefined,
    }) as Ref<DateValue>

    const defaultDate = getDefaultDate({
      defaultPlaceholder: props.placeholder,
      granularity: granularity.value,
      defaultValue: modelValue.value,
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

    const isInvalid = computed(() => {
      if (!modelValue.value) return false
      if (propsIsDateUnavailable.value?.(modelValue.value)) return true
      if (props.minValue && isBefore(modelValue.value, props.minValue)) return true
      if (props.maxValue && isBefore(props.maxValue, modelValue.value)) return true
      return false
    })

    const initialSegments = initializeSegmentValues(inferredGranularity.value)

    const segmentValues = ref<SegmentValueObj>(
      modelValue.value
        ? { ...syncSegmentValues({ value: modelValue.value, formatter }) }
        : { ...initialSegments },
    )

    const allSegmentContent = computed(() =>
      createContent({
        granularity: inferredGranularity.value,
        dateRef: placeholder.value,
        formatter,
        hideTimeZone: props.hideTimeZone,
        hourCycle: props.hourCycle,
        segmentValues: segmentValues.value,
        locale: locale.value,
      }),
    )

    const segmentContents = computed(() => allSegmentContent.value.arr)
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

    watch(modelValue, value => {
      if (value != null && placeholder.value.compare(value) !== 0) placeholder.value = value.copy()
    })

    watch([modelValue, locale], ([value]) => {
      if (value != null) segmentValues.value = { ...syncSegmentValues({ value, formatter }) }
      else if (Object.values(segmentValues.value).every(item => item !== null) && value == null)
        segmentValues.value = { ...initialSegments }
    })

    const currentFocusedElement = ref<HTMLElement | null>(null)

    const currentSegmentIndex = computed(() =>
      Array.from(segmentElements.value).findIndex(
        element =>
          element.getAttribute(DATE_FIELD_SEGMENT) ===
          currentFocusedElement.value?.getAttribute(DATE_FIELD_SEGMENT),
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

    const inputType = computed(() => getInputType(inferredGranularity.value))
    const inputValue = computed(() =>
      normalizeInputValue(modelValue.value, inferredGranularity.value),
    )
    const inputMaxValue = computed(() =>
      props.maxValue ? normalizeInputValue(props.maxValue, inferredGranularity.value) : undefined,
    )
    const inputMinValue = computed(() =>
      props.minValue ? normalizeInputValue(props.minValue, inferredGranularity.value) : undefined,
    )

    function handleKeydown(event: KeyboardEvent) {
      if (event.isComposing) return
      if (!isSegmentNavigationKey(event.key)) return
      if (event.key === kbd.ARROW_LEFT) prevFocusableSegment.value?.focus()
      if (event.key === kbd.ARROW_RIGHT) nextFocusableSegment.value?.focus()
    }

    function setFocusedElement(element: HTMLElement) {
      currentFocusedElement.value = element
    }

    provideDateFieldRootContext({
      isDateUnavailable: propsIsDateUnavailable.value,
      locale,
      modelValue,
      placeholder,
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
              type: inputType.value,
              feature: 'focusable',
              tabindex: '-1',
              value: inputValue.value,
              name: props.name,
              disabled: disabled.value,
              required: props.required,
              max: inputMaxValue.value,
              min: inputMinValue.value,
              onFocus: focusFirst,
            }),
          ]),
        },
      )
  },
})
