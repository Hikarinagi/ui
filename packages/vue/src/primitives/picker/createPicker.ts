import {
  computed,
  createTextVNode,
  defineComponent,
  guardReactiveProps,
  h,
  mergeProps,
  nextTick,
  normalizeProps,
  onMounted,
  ref,
  renderSlot,
  toDisplayString,
  toRefs,
  watch,
  withCtx,
  withKeys,
  type PropType,
  type Ref,
} from 'vue'
import { getLocalTimeZone, toCalendar, today, type DateValue } from '@internationalized/date'
import type { Grid } from '../../../../shared/src/primitives/date/calendar'
import {
  calendarHeadingOptions,
  isCalendarSelectionInvalid,
  type Matcher,
  type PageFunction,
} from '../../../../shared/src/primitives/date/calendar-view'
import { getDefaultDate, toDate } from '../../../../shared/src/primitives/date/comparators'
import {
  createDateFormatter,
  type Formatter,
} from '../../../../shared/src/primitives/date/formatter'
import {
  buildPickerGrid,
  isPickerDateDisabled,
  isPickerDateSelected,
  isPickerNextDisabled,
  isPickerPrevDisabled,
  isSamePickerPeriod,
  nextPickerSelection,
  pickerGridContains,
  pickerHeading,
  pickerLabel,
  pickerShiftCandidate,
  turnPickerPage,
  type PickerKind,
} from '../../../../shared/src/primitives/date/picker-view'
import { handleCalendarInitialFocus, kbd } from '../../../../shared/src/primitives/date/utils'
import { VISUALLY_HIDDEN_HEADING_STYLE } from '../calendar/CalendarRoot'
import { createPagingButton } from '../calendar/CalendarNav'
import { Primitive, type PrimitiveProps } from '../primitive'
import { createContext } from '../utils/createContext'
import { useDirection, type Direction } from '../utils/useDirection'
import { useId } from '../utils/useId'
import { useLocale } from '../utils/useLocale'
import { usePrimitiveElement } from '../utils/usePrimitiveElement'
import { useVModel } from '../utils/useVModel'

export interface PickerRootContext {
  locale: Ref<string>
  modelValue: Ref<DateValue | DateValue[] | undefined>
  placeholder: Ref<DateValue>
  grid: Ref<Grid<DateValue>>
  multiple: Ref<boolean>
  disabled: Ref<boolean>
  readonly: Ref<boolean>
  initialFocus: Ref<boolean>
  preventDeselect: Ref<boolean>
  yearsPerPage: Ref<number>
  fullCalendarLabel: Ref<string>
  headingValue: Ref<string>
  headingId: string
  isInvalid: Ref<boolean>
  isDisabled: Matcher
  isUnavailable: Matcher
  isSelected: Matcher
  isNextButtonDisabled: (page?: PageFunction) => boolean
  isPrevButtonDisabled: (page?: PageFunction) => boolean
  nextPage: (page?: PageFunction) => void
  prevPage: (page?: PageFunction) => void
  parentElement: Ref<HTMLElement | undefined>
  onPlaceholderChange: (date: DateValue) => void
  onChange: (date: DateValue) => void
  formatter: Formatter
  dir: Ref<Direction>
  minValue: Ref<DateValue | undefined>
  maxValue: Ref<DateValue | undefined>
}

const primitive = (as: string) =>
  ({
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false, default: as },
  }) as const

const NAMES = {
  month: { name: 'Month', label: 'year', unit: 'month' },
  year: { name: 'Year', label: 'page', unit: 'year' },
} as const

export function createPicker(kind: PickerKind) {
  const { name } = NAMES[kind]
  const [injectRootContext, provideRootContext] = createContext<PickerRootContext>(
    `${name}PickerRoot`,
  )

  const Root = defineComponent({
    name: `${name}PickerRoot`,
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
      preventDeselect: { type: Boolean, required: false, default: false },
      calendarLabel: { type: String, required: false },
      maxValue: { type: null as unknown as PropType<DateValue>, required: false },
      minValue: { type: null as unknown as PropType<DateValue>, required: false },
      locale: { type: String, required: false },
      disabled: { type: Boolean, required: false, default: false },
      readonly: { type: Boolean, required: false, default: false },
      initialFocus: { type: Boolean, required: false, default: false },
      [`is${name}Disabled`]: {
        type: Function as PropType<Matcher>,
        required: false,
        default: undefined,
      },
      [`is${name}Unavailable`]: {
        type: Function as PropType<Matcher>,
        required: false,
        default: undefined,
      },
      dir: { type: String as PropType<Direction>, required: false },
      nextPage: { type: Function as PropType<PageFunction>, required: false },
      prevPage: { type: Function as PropType<PageFunction>, required: false },
      modelValue: {
        type: null as unknown as PropType<DateValue | DateValue[] | undefined>,
        required: false,
      },
      multiple: { type: Boolean, required: false, default: false },
      ...(kind === 'year' ? { yearsPerPage: { type: Number, required: false, default: 12 } } : {}),
      ...primitive('div'),
    } as Record<string, object>,
    emits: ['update:modelValue', 'update:placeholder'],
    setup(rawProps, { emit, slots }) {
      const props = rawProps as Record<string, any>
      const {
        disabled,
        readonly,
        initialFocus,
        multiple,
        minValue,
        maxValue,
        preventDeselect,
        calendarLabel,
        defaultValue,
        nextPage: propsNextPage,
        prevPage: propsPrevPage,
        dir: propDir,
        locale: propLocale,
      } = toRefs(props) as Record<string, Ref<any>>
      const matcherDisabled = computed<Matcher | undefined>(() => props[`is${name}Disabled`])
      const matcherUnavailable = computed<Matcher | undefined>(() => props[`is${name}Unavailable`])
      const yearsPerPage = computed<number>(() => props.yearsPerPage ?? 12)

      const { primitiveElement, currentElement: parentElement } = usePrimitiveElement()
      const locale = useLocale(propLocale)
      const dir = useDirection(propDir)
      const headingId = useId(undefined, `reka-${kind}-picker-heading`)

      const modelValue = useVModel(props, 'modelValue', emit, {
        defaultValue: defaultValue!.value,
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

      const formatter = createDateFormatter(locale.value)
      const headingFormatOptions = computed(() => calendarHeadingOptions(placeholder.value))
      const grid = ref(
        buildPickerGrid(kind, placeholder.value, kind === 'year' ? yearsPerPage.value : undefined),
      ) as Ref<Grid<DateValue>>

      const bounds = () => ({
        minValue: minValue!.value,
        maxValue: maxValue!.value,
        disabled: disabled!.value,
      })
      const isDisabled = (date: DateValue) =>
        isPickerDateDisabled(kind, date, bounds(), matcherDisabled.value)
      const isUnavailable = (date: DateValue) => !!matcherUnavailable.value?.(date)
      const isNextButtonDisabled = (page?: PageFunction) =>
        isPickerNextDisabled(kind, grid.value, bounds(), propsNextPage!.value, page)
      const isPrevButtonDisabled = (page?: PageFunction) =>
        isPickerPrevDisabled(kind, grid.value, bounds(), propsPrevPage!.value, page)

      function turn(direction: 1 | -1, page?: PageFunction) {
        const next = turnPickerPage(
          kind,
          direction,
          grid.value,
          placeholder.value,
          {
            page: direction > 0 ? propsNextPage!.value : propsPrevPage!.value,
            yearsPerPage: yearsPerPage.value,
          },
          page,
        )
        grid.value = next.grid
        placeholder.value = next.placeholder
      }

      watch(placeholder, value => {
        if (pickerGridContains(kind, grid.value, value)) return
        grid.value = buildPickerGrid(kind, value, kind === 'year' ? yearsPerPage.value : undefined)
      })

      watch(kind === 'year' ? [locale, yearsPerPage] : locale, () => {
        formatter.setLocale(locale.value)
        grid.value = buildPickerGrid(
          kind,
          placeholder.value,
          kind === 'year' ? yearsPerPage.value : undefined,
        )
      })

      const headingValue = computed(() =>
        pickerHeading(kind, grid.value, formatter, locale.value, headingFormatOptions.value),
      )
      const fullCalendarLabel = computed(() =>
        pickerLabel(kind, calendarLabel!.value, headingValue.value),
      )

      const isInvalid = computed(() =>
        isCalendarSelectionInvalid(modelValue.value, isDisabled, isUnavailable),
      )
      const isSelected = (date: DateValue) => isPickerDateSelected(kind, modelValue.value, date)

      watch(modelValue, value => {
        if (Array.isArray(value) && value.length) {
          const lastValue = value.at(-1)
          if (lastValue && !isSamePickerPeriod(kind, placeholder.value, lastValue))
            onPlaceholderChange(lastValue)
        } else if (
          !Array.isArray(value) &&
          value &&
          !isSamePickerPeriod(kind, placeholder.value, value)
        )
          onPlaceholderChange(value)
      })

      function onChange(value: DateValue) {
        const next = nextPickerSelection(kind, modelValue.value, value, placeholder.value, {
          multiple: multiple!.value,
          preventDeselect: preventDeselect!.value,
        })
        if (!next) return
        if (next.placeholder) placeholder.value = next.placeholder
        modelValue.value = next.value
      }

      onMounted(() => {
        if (initialFocus!.value) handleCalendarInitialFocus(parentElement.value ?? null)
      })

      provideRootContext({
        isUnavailable,
        dir,
        isDisabled,
        locale,
        formatter,
        modelValue,
        placeholder,
        disabled: disabled!,
        initialFocus: initialFocus!,
        grid,
        multiple: multiple!,
        readonly: readonly!,
        preventDeselect: preventDeselect!,
        yearsPerPage,
        fullCalendarLabel,
        headingValue,
        headingId,
        isInvalid,
        isSelected,
        isNextButtonDisabled,
        isPrevButtonDisabled,
        nextPage: page => turn(1, page),
        prevPage: page => turn(-1, page),
        parentElement,
        onPlaceholderChange,
        onChange,
        minValue: minValue!,
        maxValue: maxValue!,
      })

      return () =>
        h(
          Primitive,
          {
            ref: primitiveElement,
            as: props.as,
            'as-child': props.asChild,
            'aria-label': fullCalendarLabel.value,
            'data-readonly': readonly!.value ? '' : undefined,
            'data-disabled': disabled!.value ? '' : undefined,
            'data-invalid': isInvalid.value ? '' : undefined,
            dir: dir.value,
          },
          {
            default: withCtx(() => [
              renderSlot(slots, 'default', {
                date: placeholder.value,
                grid: grid.value,
                locale: locale.value,
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

  const Grid = defineComponent({
    name: `${name}PickerGrid`,
    props: primitive('table'),
    setup(props, { slots }) {
      const rootContext = injectRootContext()
      const disabled = computed(() => (rootContext.disabled.value ? true : undefined))
      const readonly = computed(() => (rootContext.readonly.value ? true : undefined))
      return () =>
        h(
          Primitive,
          mergeProps(props, {
            tabindex: '-1',
            role: 'application',
            'aria-labelledby': rootContext.headingId,
            'aria-readonly': readonly.value,
            'aria-disabled': disabled.value,
            'data-readonly': readonly.value && '',
            'data-disabled': disabled.value && '',
          }),
          { default: withCtx(() => [renderSlot(slots, 'default')]) },
        )
    },
  })

  const GridBody = defineComponent({
    name: `${name}PickerGridBody`,
    props: primitive('tbody'),
    setup(props, { slots }) {
      return () =>
        h(Primitive, normalizeProps(guardReactiveProps(props)), {
          default: withCtx(() => [renderSlot(slots, 'default')]),
        })
    },
  })

  const GridRow = defineComponent({
    name: `${name}PickerGridRow`,
    props: primitive('tr'),
    setup(props, { slots }) {
      return () =>
        h(Primitive, mergeProps(props, { role: 'row' }), {
          default: withCtx(() => [renderSlot(slots, 'default')]),
        })
    },
  })

  const Cell = defineComponent({
    name: `${name}PickerCell`,
    props: {
      date: { type: null as unknown as PropType<DateValue>, required: true },
      ...primitive('td'),
    },
    setup(props, { slots }) {
      const rootContext = injectRootContext()
      return () =>
        h(
          Primitive,
          {
            as: props.as,
            'as-child': props.asChild,
            role: 'gridcell',
            'aria-selected': rootContext.isSelected(props.date) ? true : undefined,
            'aria-disabled':
              rootContext.isDisabled(props.date) || rootContext.isUnavailable?.(props.date),
            'data-disabled': rootContext.isDisabled(props.date) ? '' : undefined,
          },
          { default: withCtx(() => [renderSlot(slots, 'default')]) },
        )
    },
  })

  const CellTrigger = defineComponent({
    name: `${name}PickerCellTrigger`,
    props: {
      [kind]: { type: null as unknown as PropType<DateValue>, required: true },
      ...primitive('div'),
    } as Record<string, object>,
    setup(rawProps, { slots }) {
      const props = rawProps as Record<string, any>
      const rootContext = injectRootContext()
      const { primitiveElement } = usePrimitiveElement()
      const value = () => props[kind] as DateValue

      const displayValue = computed(() => {
        void rootContext.locale.value
        return kind === 'month'
          ? rootContext.formatter.custom(toDate(value()), { month: 'short' })
          : rootContext.formatter.fullYear(toDate(value()))
      })
      const labelText = computed(() => {
        void rootContext.locale.value
        return rootContext.formatter.custom(
          toDate(value()),
          kind === 'month' ? { month: 'long', year: 'numeric' } : { year: 'numeric' },
        )
      })
      const isUnavailableCell = computed(() => rootContext.isUnavailable?.(value()) ?? false)
      const isCurrent = computed(() =>
        isSamePickerPeriod(kind, value(), toCalendar(today(getLocalTimeZone()), value().calendar)),
      )
      const isDisabledCell = computed(() => rootContext.isDisabled(value()))
      const isFocused = computed(
        () =>
          !rootContext.disabled.value &&
          isSamePickerPeriod(kind, value(), rootContext.placeholder.value),
      )
      const isSelectedCell = computed(() => rootContext.isSelected(value()))

      function change(date: DateValue) {
        if (rootContext.readonly.value) return
        if (rootContext.isDisabled(date) || rootContext.isUnavailable?.(date)) return
        rootContext.onChange(date)
      }

      function handleClick() {
        if (isDisabledCell.value) return
        change(value())
      }

      function candidate(current: DateValue, add: number, unit: 'cell' | 'page') {
        return pickerShiftCandidate(kind, current, add, unit, {
          minValue: rootContext.minValue.value,
          maxValue: rootContext.maxValue.value,
          yearsPerPage: rootContext.yearsPerPage.value,
        })
      }

      function query(date: DateValue) {
        return rootContext.parentElement.value!.querySelector<HTMLElement>(
          `[data-value='${date.toString()}']`,
        )
      }

      function shiftFocus(current: DateValue, add: number, depth = 0) {
        if (depth > 48) return
        const target = candidate(current, add, 'cell')
        if (!target) return
        const element = query(target)
        if (!element) {
          if (add > 0) {
            if (rootContext.isNextButtonDisabled()) return
            rootContext.nextPage()
          } else {
            if (rootContext.isPrevButtonDisabled()) return
            rootContext.prevPage()
          }
          void nextTick(() => shiftFocus(current, add, depth + 1))
          return
        }
        if (element.hasAttribute('data-disabled')) return shiftFocus(target, add, depth + 1)
        rootContext.onPlaceholderChange(target)
        element.focus()
      }

      function shiftFocusPage(direction: number) {
        const target = candidate(value(), direction, 'page')
        if (!target) return
        if (direction > 0) {
          if (rootContext.isNextButtonDisabled()) return
          rootContext.nextPage()
        } else {
          if (rootContext.isPrevButtonDisabled()) return
          rootContext.prevPage()
        }
        void nextTick(() => {
          const element = query(target)
          if (element && !element.hasAttribute('data-disabled')) {
            rootContext.onPlaceholderChange(target)
            element.focus()
            return
          }
          if (kind === 'year' && (!element || element.hasAttribute('data-disabled')))
            shiftFocus(target, direction > 0 ? 1 : -1, 1)
        })
      }

      function handleArrowKey(event: KeyboardEvent) {
        if (isDisabledCell.value) return
        if (
          (event.code === kbd.ENTER || event.code === kbd.SPACE_CODE) &&
          (event.ctrlKey || event.metaKey || event.altKey)
        )
          return
        event.preventDefault()
        event.stopPropagation()
        const sign = rootContext.dir.value === 'rtl' ? -1 : 1
        switch (event.code) {
          case kbd.ARROW_RIGHT:
            shiftFocus(value(), sign)
            break
          case kbd.ARROW_LEFT:
            shiftFocus(value(), -sign)
            break
          case kbd.ARROW_UP:
            shiftFocus(value(), -4)
            break
          case kbd.ARROW_DOWN:
            shiftFocus(value(), 4)
            break
          case kbd.PAGE_UP:
            shiftFocusPage(-1)
            break
          case kbd.PAGE_DOWN:
            shiftFocusPage(1)
            break
          case kbd.ENTER:
          case kbd.SPACE_CODE:
            change(value())
        }
      }

      const onKeydown = withKeys(handleArrowKey as (event: Event) => void, [
        'up',
        'down',
        'left',
        'right',
        'space',
        'enter',
        'page-up',
        'page-down',
      ])

      return () =>
        h(
          Primitive,
          {
            ref: primitiveElement,
            as: props.as,
            'as-child': props.asChild,
            role: 'button',
            'aria-label': labelText.value,
            [`data-reka-${kind}-picker-cell-trigger`]: '',
            'aria-disabled': isDisabledCell.value || isUnavailableCell.value ? true : undefined,
            'data-selected': isSelectedCell.value ? (kind === 'month' ? true : '') : undefined,
            'data-value': value().toString(),
            'data-disabled': isDisabledCell.value ? '' : undefined,
            'data-unavailable': isUnavailableCell.value ? '' : undefined,
            'data-today': isCurrent.value ? '' : undefined,
            'data-focused': isFocused.value ? '' : undefined,
            tabindex: isFocused.value ? 0 : isDisabledCell.value ? undefined : -1,
            onClick: handleClick,
            onKeydown,
          },
          {
            default: withCtx(() => [
              renderSlot(
                slots,
                'default',
                {
                  [`${kind}Value`]: displayValue.value,
                  disabled: isDisabledCell.value,
                  today: isCurrent.value,
                  selected: isSelectedCell.value,
                  unavailable: isUnavailableCell.value,
                },
                () => [createTextVNode(toDisplayString(displayValue.value), 1)],
              ),
            ]),
          },
        )
    },
  })

  const Next = createPagingButton(`${name}PickerNext`, 'next', injectRootContext, NAMES[kind].label)
  const Prev = createPagingButton(`${name}PickerPrev`, 'prev', injectRootContext, NAMES[kind].label)

  return { Root, Grid, GridBody, GridRow, Cell, CellTrigger, Next, Prev, injectRootContext }
}
