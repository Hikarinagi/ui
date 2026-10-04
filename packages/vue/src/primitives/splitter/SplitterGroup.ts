import {
  computed,
  defineComponent,
  h,
  normalizeStyle,
  ref,
  renderSlot,
  toRefs,
  watch,
  watchEffect,
  withCtx,
  type PropType,
} from 'vue'
import { areEqual } from '../../../../shared/src/primitives/splitter/arrays'
import { assert } from '../../../../shared/src/primitives/splitter/assert'
import {
  calculateDeltaPercentage,
  calculateUnsafeDefaultLayout,
} from '../../../../shared/src/primitives/splitter/calculate'
import { callPanelCallbacks } from '../../../../shared/src/primitives/splitter/callPanelCallbacks'
import { fuzzyCompareNumbers } from '../../../../shared/src/primitives/splitter/compare'
import { debounce } from '../../../../shared/src/primitives/splitter/debounce'
import { getResizeHandleElement } from '../../../../shared/src/primitives/splitter/dom'
import {
  getResizeEventCursorPosition,
  isKeyDown,
  isMouseEvent,
  isTouchEvent,
} from '../../../../shared/src/primitives/splitter/events'
import {
  EXCEEDED_HORIZONTAL_MAX,
  EXCEEDED_HORIZONTAL_MIN,
  EXCEEDED_VERTICAL_MAX,
  EXCEEDED_VERTICAL_MIN,
} from '../../../../shared/src/primitives/splitter/flags'
import {
  adjustLayoutByDelta,
  compareLayouts,
} from '../../../../shared/src/primitives/splitter/layout'
import { determinePivotIndices } from '../../../../shared/src/primitives/splitter/pivot'
import { reportConstraintsViolation } from '../../../../shared/src/primitives/splitter/registry'
import {
  initializeDefaultStorage,
  loadPanelGroupState,
  savePanelGroupState,
} from '../../../../shared/src/primitives/splitter/storage'
import { computePanelFlexBoxStyle } from '../../../../shared/src/primitives/splitter/style'
import type {
  Direction,
  DragState,
  PanelConstraints,
  PanelData,
  PanelGroupStorage,
  ResizeEvent,
} from '../../../../shared/src/primitives/splitter/types'
import {
  convertPanelConstraintsToPercent,
  hasPixelSizedPanel,
  recalculateLayoutForPixelPanels,
} from '../../../../shared/src/primitives/splitter/units'
import { validatePanelGroupLayout } from '../../../../shared/src/primitives/splitter/validation'
import { Primitive, type PrimitiveProps } from '../primitive'
import { useDirection } from '../utils/useDirection'
import { useForwardExpose } from '../utils/useForwardExpose'
import { useId } from '../utils/useId'
import { useWindowSplitterPanelGroupBehavior, type EagerValues } from './behaviors'
import { providePanelGroupContext } from './context'

const LOCAL_STORAGE_DEBOUNCE_INTERVAL = 100

const defaultStorage: PanelGroupStorage = {
  getItem: name => {
    initializeDefaultStorage(defaultStorage)
    return defaultStorage.getItem(name)
  },
  setItem: (name, value) => {
    initializeDefaultStorage(defaultStorage)
    defaultStorage.setItem(name, value)
  },
}

export interface SplitterGroupProps {
  id?: string | null
  autoSaveId?: string | null
  direction: Direction
  keyboardResizeBy?: number | null
  storage?: PanelGroupStorage
  asChild?: boolean
  as?: PrimitiveProps['as']
}

export type SplitterGroupEmits = {
  layout: [value: number[]]
}

export const SplitterGroup = defineComponent({
  name: 'SplitterGroup',
  props: {
    id: { type: [String, null] as PropType<string | null>, required: false },
    autoSaveId: { type: [String, null] as PropType<string | null>, required: false, default: null },
    direction: { type: String as PropType<Direction>, required: true },
    keyboardResizeBy: {
      type: [Number, null] as PropType<number | null>,
      required: false,
      default: 10,
    },
    storage: {
      type: Object as PropType<PanelGroupStorage>,
      required: false,
      default: () => defaultStorage,
    },
    asChild: { type: Boolean, required: false },
    as: { type: null as unknown as PropType<PrimitiveProps['as']>, required: false },
  },
  emits: ['layout'],
  setup(props, { emit, slots }) {
    const debounceMap: Record<string, (...args: Parameters<typeof savePanelGroupState>) => void> =
      {}
    const { direction } = toRefs(props)
    const groupId = useId(props.id, 'reka-splitter-group')
    const dir = useDirection()
    const { forwardRef, currentElement: panelGroupElementRef } = useForwardExpose()
    const dragState = ref<DragState | null>(null)
    const groupSizeInPixels = ref<number | null>(null)
    const groupSizeAtLastLayoutInit = ref<number | null>(null)
    const layout = ref<number[]>([])
    const panelIdToLastNotifiedSizeMapRef = ref<Record<string, number>>({})
    const panelSizeBeforeCollapseRef = ref(new Map<string, number>())
    const prevDeltaRef = ref(0)

    const committedValuesRef = computed(() => ({
      autoSaveId: props.autoSaveId,
      direction: props.direction,
      dragState: dragState.value,
      id: groupId,
      keyboardResizeBy: props.keyboardResizeBy,
      storage: props.storage,
    }))

    const eagerValuesRef = ref<EagerValues>({
      layout: layout.value,
      panelDataArray: [],
      panelDataArrayChanged: false,
    })

    function getGroupSizeInPixels() {
      if (groupSizeInPixels.value != null) return groupSizeInPixels.value
      const element = panelGroupElementRef.value
      if (element && element instanceof HTMLElement) {
        const rect = element.getBoundingClientRect()
        const size = direction.value === 'horizontal' ? rect.width : rect.height
        if (!Number.isNaN(size)) {
          groupSizeInPixels.value = size
          return size
        }
      }
      return null
    }

    function getPanelConstraintsInPercent(groupSizeOverride?: number | null) {
      const groupSize = groupSizeOverride ?? getGroupSizeInPixels()
      return convertPanelConstraintsToPercent({
        panelDataArray: eagerValuesRef.value.panelDataArray,
        groupSizeInPixels: groupSize,
      })
    }

    function getPanelDataWithPercentConstraints(groupSizeOverride?: number | null) {
      const percentConstraints = getPanelConstraintsInPercent(groupSizeOverride)
      if (!percentConstraints) return null
      return eagerValuesRef.value.panelDataArray.map((panelData, index) => ({
        ...panelData,
        constraints: percentConstraints[index]!,
      }))
    }

    const setLayout = (value: number[]) => (layout.value = value)

    function convertLayoutToNativeUnits(internalLayout: number[]) {
      const { panelDataArray } = eagerValuesRef.value
      const groupSize = getGroupSizeInPixels()
      return internalLayout.map((size, index) => {
        const panelData = panelDataArray[index]
        if (panelData && (panelData.constraints.sizeUnit ?? '%') === 'px' && groupSize != null)
          return (size / 100) * groupSize
        return size
      })
    }

    function commitLayout(nextLayout: number[], panelDataArray: PanelData[]) {
      setLayout(nextLayout)
      eagerValuesRef.value.layout = nextLayout
      emit('layout', convertLayoutToNativeUnits(nextLayout))
      callPanelCallbacks(
        panelDataArray,
        nextLayout,
        panelIdToLastNotifiedSizeMapRef.value,
        getGroupSizeInPixels(),
      )
    }

    useWindowSplitterPanelGroupBehavior({
      eagerValuesRef,
      groupId,
      layout,
      panelGroupElement: panelGroupElementRef,
      setLayout,
      getPanelDataWithPercentConstraints,
    })

    watchEffect(onCleanup => {
      const element = panelGroupElementRef.value
      if (!element) return
      if (typeof ResizeObserver !== 'function') return
      const resizeObserver = new ResizeObserver(entries => {
        const entry = entries[0]
        if (!entry) return
        const { height, width } = entry.contentRect
        const nextSize = direction.value === 'horizontal' ? width : height
        if (!Number.isNaN(nextSize)) groupSizeInPixels.value = nextSize
      })
      if (element instanceof HTMLElement) resizeObserver.observe(element)
      onCleanup(() => resizeObserver.disconnect())
    })

    watchEffect(() => {
      const { panelDataArray } = eagerValuesRef.value
      const { autoSaveId } = props
      if (!autoSaveId) return
      if (layout.value.length === 0 || layout.value.length !== panelDataArray.length) return
      let debouncedSave = debounceMap[autoSaveId]
      if (!debouncedSave) {
        debouncedSave = debounce(savePanelGroupState, LOCAL_STORAGE_DEBOUNCE_INTERVAL)
        debounceMap[autoSaveId] = debouncedSave
      }
      debouncedSave(
        autoSaveId,
        [...panelDataArray],
        new Map(panelSizeBeforeCollapseRef.value),
        layout.value,
        props.storage,
      )
    })

    function getPanelStyle(panelData: PanelData, defaultSize: number | undefined) {
      const { panelDataArray } = eagerValuesRef.value
      const panelIndex = findPanelDataIndex(panelDataArray, panelData)
      return computePanelFlexBoxStyle({
        defaultSize,
        dragState: dragState.value,
        layout: layout.value,
        panelData: panelDataArray,
        panelIndex,
      })
    }

    function registerPanel(panelData: PanelData) {
      const { panelDataArray } = eagerValuesRef.value
      panelDataArray.push(panelData)
      panelDataArray.sort((panelA, panelB) => {
        const orderA = panelA.order
        const orderB = panelB.order
        if (orderA == null && orderB == null) return 0
        if (orderA == null) return -1
        if (orderB == null) return 1
        return orderA - orderB
      })
      eagerValuesRef.value.panelDataArrayChanged = true
    }

    watch(
      () => eagerValuesRef.value.panelDataArrayChanged,
      () => {
        if (!eagerValuesRef.value.panelDataArrayChanged) return
        eagerValuesRef.value.panelDataArrayChanged = false
        const { autoSaveId, storage } = committedValuesRef.value
        const { layout: prevLayout, panelDataArray } = eagerValuesRef.value
        let unsafeLayout: number[] | null = null
        if (autoSaveId) {
          const state = loadPanelGroupState(autoSaveId, panelDataArray, storage)
          if (state) {
            panelSizeBeforeCollapseRef.value = new Map(Object.entries(state.expandToSizes))
            unsafeLayout = state.layout
          }
        }
        if (unsafeLayout === null) {
          const panels = getPanelDataWithPercentConstraints()
          if (!panels) return
          unsafeLayout = calculateUnsafeDefaultLayout({ panelDataArray: panels })
        }
        const panelConstraints = getPanelConstraintsInPercent()
        if (!panelConstraints) return
        const nextLayout = validatePanelGroupLayout({ layout: unsafeLayout, panelConstraints })
        groupSizeAtLastLayoutInit.value = getGroupSizeInPixels()
        if (!areEqual(prevLayout, nextLayout)) commitLayout(nextLayout, panelDataArray)
      },
    )

    watch(groupSizeInPixels, (nextSize, prevSize) => {
      if (prevSize == null || nextSize == null) return
      const { layout: prevLayout, panelDataArray } = eagerValuesRef.value
      if (prevLayout.length === 0) return
      if (!hasPixelSizedPanel(panelDataArray)) return
      const initSize = groupSizeAtLastLayoutInit.value
      if (initSize != null && initSize > 0 && initSize < 50 && nextSize > initSize * 10) {
        eagerValuesRef.value.panelDataArrayChanged = true
        return
      }
      const recalculatedLayout = recalculateLayoutForPixelPanels({
        layout: prevLayout,
        panelDataArray,
        prevGroupSize: prevSize,
        nextGroupSize: nextSize,
      })
      if (!recalculatedLayout) return
      const panelConstraints = getPanelConstraintsInPercent(nextSize)
      if (!panelConstraints) return
      const nextLayout = validatePanelGroupLayout({ layout: recalculatedLayout, panelConstraints })
      if (!compareLayouts(prevLayout, nextLayout)) commitLayout(nextLayout, panelDataArray)
    })

    function registerResizeHandle(dragHandleId: string) {
      return function resizeHandler(event: ResizeEvent) {
        event.preventDefault()
        const panelGroupElement = panelGroupElementRef.value
        if (!panelGroupElement) return
        const {
          direction: currentDirection,
          dragState: currentDragState,
          id: currentGroupId,
          keyboardResizeBy,
        } = committedValuesRef.value
        const { layout: prevLayout, panelDataArray } = eagerValuesRef.value
        const { initialLayout } = currentDragState ?? {}
        const pivotIndices = determinePivotIndices(currentGroupId, dragHandleId, panelGroupElement)
        let delta = calculateDeltaPercentage(
          event,
          dragHandleId,
          currentDirection,
          currentDragState,
          keyboardResizeBy,
          panelGroupElement,
        )
        if (delta === 0) return
        const isHorizontal = currentDirection === 'horizontal'
        if (dir.value === 'rtl' && isHorizontal) delta = -delta
        const panelConstraints = getPanelConstraintsInPercent()
        if (!panelConstraints) return
        const nextLayout = adjustLayoutByDelta({
          delta,
          layout: initialLayout ?? prevLayout,
          panelConstraints,
          pivotIndices,
          trigger: isKeyDown(event) ? 'keyboard' : 'mouse-or-touch',
        })
        const layoutChanged = !compareLayouts(prevLayout, nextLayout)
        if ((isMouseEvent(event) || isTouchEvent(event)) && prevDeltaRef.value !== delta) {
          prevDeltaRef.value = delta
          if (!layoutChanged) {
            if (isHorizontal)
              reportConstraintsViolation(
                dragHandleId,
                delta < 0 ? EXCEEDED_HORIZONTAL_MIN : EXCEEDED_HORIZONTAL_MAX,
              )
            else
              reportConstraintsViolation(
                dragHandleId,
                delta < 0 ? EXCEEDED_VERTICAL_MIN : EXCEEDED_VERTICAL_MAX,
              )
          } else reportConstraintsViolation(dragHandleId, 0)
        }
        if (layoutChanged) commitLayout(nextLayout, panelDataArray)
      }
    }

    function resizePanel(panelData: PanelData, unsafePanelSize: number) {
      const { layout: prevLayout, panelDataArray } = eagerValuesRef.value
      const panelConstraintsArray = getPanelConstraintsInPercent()
      if (!panelConstraintsArray) return
      const panelIndex = findPanelDataIndex(panelDataArray, panelData)
      const panelUnit = panelData.constraints.sizeUnit ?? '%'
      let sizeInPercent = unsafePanelSize
      if (panelUnit === 'px') {
        const groupSize = getGroupSizeInPixels()
        if (groupSize != null) sizeInPercent = (unsafePanelSize / groupSize) * 100
      }
      const { panelSize, pivotIndices } = panelDataHelper(
        panelDataArray,
        panelData,
        prevLayout,
        panelConstraintsArray,
      )
      assert(panelSize != null)
      const isLastPanel = panelIndex === panelDataArray.length - 1
      const delta = isLastPanel ? panelSize - sizeInPercent : sizeInPercent - panelSize
      const nextLayout = adjustLayoutByDelta({
        delta,
        layout: prevLayout,
        panelConstraints: panelConstraintsArray,
        pivotIndices,
        trigger: 'imperative-api',
      })
      if (!compareLayouts(prevLayout, nextLayout)) commitLayout(nextLayout, panelDataArray)
    }

    function reevaluatePanelConstraints(panelData: PanelData, _prevConstraints: PanelConstraints) {
      const { layout: currentLayout, panelDataArray } = eagerValuesRef.value
      const index = findPanelDataIndex(panelDataArray, panelData)
      panelDataArray[index] = panelData
      eagerValuesRef.value.panelDataArrayChanged = true
      const panelConstraintsArray = getPanelConstraintsInPercent()
      if (!panelConstraintsArray) return
      const nextConstraints = panelConstraintsArray[index]
      const { panelSize: prevPanelSize } = panelDataHelper(
        panelDataArray,
        panelData,
        currentLayout,
        panelConstraintsArray,
      )
      if (prevPanelSize === null) return
      const nextCollapsedSize = nextConstraints?.collapsedSize ?? 0
      const nextMaxSize = nextConstraints?.maxSize ?? 100
      const nextMinSize = nextConstraints?.minSize ?? 0
      if (nextConstraints?.collapsible && isPanelCollapsed(panelData)) {
        if (prevPanelSize !== nextCollapsedSize) resizePanel(panelData, nextCollapsedSize)
      } else if (prevPanelSize! < nextMinSize) resizePanel(panelData, nextMinSize)
      else if (prevPanelSize! > nextMaxSize) resizePanel(panelData, nextMaxSize)
    }

    function startDragging(dragHandleId: string, event: ResizeEvent) {
      const { direction: currentDirection } = committedValuesRef.value
      const { layout: currentLayout } = eagerValuesRef.value
      if (!panelGroupElementRef.value) return
      const handleElement = getResizeHandleElement(dragHandleId, panelGroupElementRef.value)
      assert(handleElement)
      const initialCursorPosition = getResizeEventCursorPosition(currentDirection, event)
      dragState.value = {
        dragHandleId,
        dragHandleRect: handleElement.getBoundingClientRect(),
        initialCursorPosition,
        initialLayout: currentLayout,
      }
    }

    function stopDragging() {
      dragState.value = null
    }

    function unregisterPanel(panelData: PanelData) {
      const { panelDataArray } = eagerValuesRef.value
      const index = findPanelDataIndex(panelDataArray, panelData)
      if (index >= 0) {
        panelDataArray.splice(index, 1)
        delete panelIdToLastNotifiedSizeMapRef.value[panelData.id]
        eagerValuesRef.value.panelDataArrayChanged = true
      }
    }

    function collapsePanel(panelData: PanelData) {
      const { layout: prevLayout, panelDataArray } = eagerValuesRef.value
      if (!panelData.constraints.collapsible) return
      const panelConstraintsArray = getPanelConstraintsInPercent()
      if (!panelConstraintsArray) return
      const {
        collapsedSize = 0,
        panelSize,
        pivotIndices,
      } = panelDataHelper(panelDataArray, panelData, prevLayout, panelConstraintsArray)
      assert(panelSize != null, `Panel size not found for panel "${panelData.id}"`)
      if (panelSize === collapsedSize) return
      const sizeUnit = panelData.constraints.sizeUnit ?? '%'
      const groupSize = groupSizeInPixels.value ?? getGroupSizeInPixels()
      const sizeBeforeCollapse =
        sizeUnit === 'px' && groupSize ? (panelSize / 100) * groupSize : panelSize
      panelSizeBeforeCollapseRef.value.set(panelData.id, sizeBeforeCollapse)
      const isLastPanel =
        findPanelDataIndex(panelDataArray, panelData) === panelDataArray.length - 1
      const delta = isLastPanel ? panelSize - collapsedSize : collapsedSize - panelSize
      const nextLayout = adjustLayoutByDelta({
        delta,
        layout: prevLayout,
        panelConstraints: panelConstraintsArray,
        pivotIndices,
        trigger: 'imperative-api',
      })
      if (!compareLayouts(prevLayout, nextLayout)) commitLayout(nextLayout, panelDataArray)
    }

    function expandPanel(panelData: PanelData) {
      const { layout: prevLayout, panelDataArray } = eagerValuesRef.value
      if (!panelData.constraints.collapsible) return
      const panelConstraintsArray = getPanelConstraintsInPercent()
      if (!panelConstraintsArray) return
      const {
        collapsedSize = 0,
        panelSize = 0,
        minSize = 0,
        pivotIndices,
      } = panelDataHelper(panelDataArray, panelData, prevLayout, panelConstraintsArray)
      if (fuzzyCompareNumbers(panelSize, collapsedSize) > 0) return
      const prevPanelSize = panelSizeBeforeCollapseRef.value.get(panelData.id)
      const sizeUnit = panelData.constraints.sizeUnit ?? '%'
      const groupSize = groupSizeInPixels.value ?? getGroupSizeInPixels()
      const restoredSize =
        sizeUnit === 'px' && groupSize
          ? prevPanelSize != null
            ? (prevPanelSize / groupSize) * 100
            : null
          : prevPanelSize
      const baseSize = restoredSize != null && restoredSize >= minSize ? restoredSize : minSize
      const isLastPanel =
        findPanelDataIndex(panelDataArray, panelData) === panelDataArray.length - 1
      const delta = isLastPanel ? panelSize - baseSize : baseSize - panelSize
      const nextLayout = adjustLayoutByDelta({
        delta,
        layout: prevLayout,
        panelConstraints: panelConstraintsArray,
        pivotIndices,
        trigger: 'imperative-api',
      })
      if (!compareLayouts(prevLayout, nextLayout)) commitLayout(nextLayout, panelDataArray)
    }

    function getPanelSize(panelData: PanelData) {
      const { layout: currentLayout, panelDataArray } = eagerValuesRef.value
      const { panelSize } = panelDataHelper(panelDataArray, panelData, currentLayout)
      assert(panelSize != null, `Panel size not found for panel "${panelData.id}"`)
      if ((panelData.constraints.sizeUnit ?? '%') === 'px') {
        const groupSize = getGroupSizeInPixels()
        if (groupSize != null) return (panelSize / 100) * groupSize
      }
      return panelSize
    }

    function isPanelCollapsed(panelData: PanelData) {
      const { layout: currentLayout, panelDataArray } = eagerValuesRef.value
      const panelConstraintsArray = getPanelConstraintsInPercent()
      const {
        collapsedSize = 0,
        collapsible,
        panelSize,
      } = panelDataHelper(
        panelDataArray,
        panelData,
        currentLayout,
        panelConstraintsArray ?? undefined,
      )
      if (!collapsible) return false
      if (panelSize === undefined) {
        const panelIndex = findPanelDataIndex(panelDataArray, panelData)
        const constraints = panelConstraintsArray?.[panelIndex] ?? panelData.constraints
        return constraints.defaultSize === constraints.collapsedSize
      }
      return fuzzyCompareNumbers(panelSize, collapsedSize) <= 0
    }

    function isPanelExpanded(panelData: PanelData) {
      const { layout: currentLayout, panelDataArray } = eagerValuesRef.value
      const panelConstraintsArray = getPanelConstraintsInPercent()
      const {
        collapsedSize = 0,
        collapsible,
        panelSize,
      } = panelDataHelper(
        panelDataArray,
        panelData,
        currentLayout,
        panelConstraintsArray ?? undefined,
      )
      assert(panelSize != null, `Panel size not found for panel "${panelData.id}"`)
      return !collapsible || fuzzyCompareNumbers(panelSize, collapsedSize) > 0
    }

    providePanelGroupContext({
      direction,
      dragState: dragState.value,
      groupId,
      reevaluatePanelConstraints,
      registerPanel,
      registerResizeHandle,
      resizePanel,
      startDragging,
      stopDragging,
      unregisterPanel,
      panelGroupElement: panelGroupElementRef,
      collapsePanel,
      expandPanel,
      isPanelCollapsed,
      isPanelExpanded,
      getPanelSize,
      getPanelStyle,
    })

    function findPanelDataIndex(panelDataArray: PanelData[], panelData: PanelData) {
      return panelDataArray.findIndex(
        prevPanelData => prevPanelData === panelData || prevPanelData.id === panelData.id,
      )
    }

    function panelDataHelper(
      panelDataArray: PanelData[],
      panelData: PanelData,
      currentLayout: number[],
      panelConstraints?: PanelConstraints[] | null,
    ) {
      const panelIndex = findPanelDataIndex(panelDataArray, panelData)
      const isLastPanel = panelIndex === panelDataArray.length - 1
      const pivotIndices: [number, number] = isLastPanel
        ? [panelIndex - 1, panelIndex]
        : [panelIndex, panelIndex + 1]
      const constraints = panelConstraints ?? getPanelConstraintsInPercent()
      const panelConstraintsFromGroup = constraints?.[panelIndex]
      const panelSize = currentLayout[panelIndex]
      return {
        ...(panelConstraintsFromGroup ?? panelData.constraints),
        panelSize,
        pivotIndices,
      }
    }

    return () =>
      h(
        Primitive,
        {
          ref: forwardRef,
          as: props.as,
          'as-child': props.asChild,
          style: normalizeStyle({
            display: 'flex',
            flexDirection: direction.value === 'horizontal' ? 'row' : 'column',
            height: '100%',
            overflow: 'hidden',
            width: '100%',
          }),
          'data-panel-group': '',
          'data-orientation': direction.value,
          'data-panel-group-id': groupId,
        },
        { default: withCtx(() => [renderSlot(slots, 'default', { layout: layout.value })]) },
      )
  },
})
