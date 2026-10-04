'use client'

import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, HTMLAttributes, ReactNode, Ref } from 'react'
import { Primitive, type PrimitiveProps } from '../../lib/primitive'
import { PanelGroupContext, type PanelGroupApi, type PanelGroupContextValue } from './context'
import { areEqual } from './utils/arrays'
import { assert } from './utils/assert'
import {
  calculateAriaValues,
  calculateDeltaPercentage,
  calculateUnsafeDefaultLayout,
} from './utils/calculate'
import { callPanelCallbacks } from './utils/callPanelCallbacks'
import { fuzzyCompareNumbers, fuzzyNumbersEqual } from './utils/compare'
import { debounce } from './utils/debounce'
import {
  getPanelGroupElement,
  getResizeHandleElement,
  getResizeHandleElementsForGroup,
  getResizeHandlePanelIds,
} from './utils/dom'
import { getResizeEventCursorPosition, isKeyDown, isMouseEvent, isTouchEvent } from './utils/events'
import { adjustLayoutByDelta, compareLayouts } from './utils/layout'
import { determinePivotIndices } from './utils/pivot'
import {
  EXCEEDED_HORIZONTAL_MAX,
  EXCEEDED_HORIZONTAL_MIN,
  EXCEEDED_VERTICAL_MAX,
  EXCEEDED_VERTICAL_MIN,
  reportConstraintsViolation,
} from './utils/registry'
import { initializeDefaultStorage, loadPanelGroupState, savePanelGroupState } from './utils/storage'
import { computePanelFlexBoxStyle } from './utils/style'
import {
  convertPanelConstraintsToPercent,
  hasPixelSizedPanel,
  recalculateLayoutForPixelPanels,
} from './utils/units'
import { validatePanelGroupLayout } from './utils/validation'
import type {
  Direction,
  DragState,
  PanelConstraints,
  PanelData,
  PanelGroupStorage,
  ResizeEvent,
} from './utils/types'
import { useComposedRefs } from '../utils/compose-refs'
import { useDirection } from '../utils/direction'

const LOCAL_STORAGE_DEBOUNCE_INTERVAL = 100

const defaultStorage: PanelGroupStorage = {
  getItem: (name: string) => {
    initializeDefaultStorage(defaultStorage)
    return defaultStorage.getItem(name)
  },
  setItem: (name: string, value: string) => {
    initializeDefaultStorage(defaultStorage)
    defaultStorage.setItem(name, value)
  },
}

export interface SplitterGroupProps extends PrimitiveProps, HTMLAttributes<HTMLElement> {
  id?: string
  autoSaveId?: string | null
  direction: Direction
  keyboardResizeBy?: number | null
  storage?: PanelGroupStorage
  onLayout?: (layout: number[]) => void
  children?: ReactNode
  ref?: Ref<HTMLElement>
}

interface GroupSettings {
  autoSaveId: string | null
  direction: Direction
  dir: 'ltr' | 'rtl'
  groupId: string
  keyboardResizeBy: number | null
  storage: PanelGroupStorage
  onLayout?: (layout: number[]) => void
}

interface GroupStore {
  layout: number[]
  eager: { layout: number[]; panelDataArray: PanelData[]; panelDataArrayChanged: boolean }
  dragState: DragState | null
  groupSizeInPixels: number | null
  groupSizeAtLastLayoutInit: number | null
  panelIdToLastNotifiedSizeMap: Record<string, number>
  panelSizeBeforeCollapse: Map<string, number>
  prevDelta: number
}

function findPanelDataIndex(panelDataArray: PanelData[], panelData: PanelData) {
  return panelDataArray.findIndex(
    prevPanelData => prevPanelData === panelData || prevPanelData.id === panelData.id,
  )
}

function createPanelGroup(
  element: { readonly current: HTMLElement | null },
  settings: () => GroupSettings,
  store: GroupStore,
  setters: {
    layout: (layout: number[]) => void
    dragState: (dragState: DragState | null) => void
    panelDataChanged: () => void
  },
) {
  function getGroupSizeInPixels() {
    if (store.groupSizeInPixels != null) return store.groupSizeInPixels
    const el = element.current
    if (el && el instanceof HTMLElement) {
      const rect = el.getBoundingClientRect()
      const size = settings().direction === 'horizontal' ? rect.width : rect.height
      if (!Number.isNaN(size)) {
        store.groupSizeInPixels = size
        return size
      }
    }
    return null
  }

  function getPanelConstraintsInPercent(groupSizeOverride?: number | null) {
    const groupSize = groupSizeOverride ?? getGroupSizeInPixels()
    return convertPanelConstraintsToPercent({
      panelDataArray: store.eager.panelDataArray,
      groupSizeInPixels: groupSize,
    })
  }

  function getPanelDataWithPercentConstraints(groupSizeOverride?: number | null) {
    const percentConstraints = getPanelConstraintsInPercent(groupSizeOverride)
    if (!percentConstraints) return null
    return store.eager.panelDataArray.map((panelData, index) => ({
      ...panelData,
      constraints: percentConstraints[index]!,
    }))
  }

  function setLayout(value: number[]) {
    store.layout = value
    setters.layout(value)
  }

  function convertLayoutToNativeUnits(internalLayout: number[]) {
    const { panelDataArray } = store.eager
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
    store.eager.layout = nextLayout
    settings().onLayout?.(convertLayoutToNativeUnits(nextLayout))
    callPanelCallbacks(
      panelDataArray,
      nextLayout,
      store.panelIdToLastNotifiedSizeMap,
      getGroupSizeInPixels(),
    )
  }

  function panelDataHelper(
    panelDataArray: PanelData[],
    panelData: PanelData,
    layout: number[],
    panelConstraints?: PanelConstraints[],
  ) {
    const panelIndex = findPanelDataIndex(panelDataArray, panelData)
    const isLastPanel = panelIndex === panelDataArray.length - 1
    const pivotIndices = isLastPanel ? [panelIndex - 1, panelIndex] : [panelIndex, panelIndex + 1]
    const constraints = panelConstraints ?? getPanelConstraintsInPercent()
    const panelConstraintsFromGroup = constraints?.[panelIndex]
    const panelSize = layout[panelIndex]
    return {
      ...(panelConstraintsFromGroup ?? panelData.constraints),
      panelSize,
      pivotIndices,
    }
  }

  function getPanelStyle(panelData: PanelData, defaultSize: number | undefined) {
    const { panelDataArray } = store.eager
    const panelIndex = findPanelDataIndex(panelDataArray, panelData)
    return computePanelFlexBoxStyle({
      defaultSize,
      dragState: store.dragState,
      layout: store.layout,
      panelData: panelDataArray,
      panelIndex,
    })
  }

  function registerPanel(panelData: PanelData) {
    const { panelDataArray } = store.eager
    panelDataArray.push(panelData)
    panelDataArray.sort((panelA, panelB) => {
      const orderA = panelA.order
      const orderB = panelB.order
      if (orderA == null && orderB == null) return 0
      else if (orderA == null) return -1
      else if (orderB == null) return 1
      else return orderA - orderB
    })
    store.eager.panelDataArrayChanged = true
    setters.panelDataChanged()
  }

  function processPanelDataArrayChange() {
    if (!store.eager.panelDataArrayChanged) return
    store.eager.panelDataArrayChanged = false
    const { autoSaveId, storage } = settings()
    const { layout: prevLayout, panelDataArray } = store.eager
    let unsafeLayout: number[] | null = null
    if (autoSaveId) {
      const state = loadPanelGroupState(autoSaveId, panelDataArray, storage)
      if (state) {
        store.panelSizeBeforeCollapse = new Map(Object.entries(state.expandToSizes))
        unsafeLayout = state.layout
      }
    }
    if (unsafeLayout === null) {
      const panelDataArrayWithPercentConstraints = getPanelDataWithPercentConstraints()
      if (!panelDataArrayWithPercentConstraints) return
      unsafeLayout = calculateUnsafeDefaultLayout({
        panelDataArray: panelDataArrayWithPercentConstraints,
      })
    }
    const panelConstraints = getPanelConstraintsInPercent()
    if (!panelConstraints) return
    const nextLayout = validatePanelGroupLayout({ layout: unsafeLayout, panelConstraints })
    store.groupSizeAtLastLayoutInit = getGroupSizeInPixels()
    if (!areEqual(prevLayout, nextLayout)) commitLayout(nextLayout, panelDataArray)
  }

  function setGroupSizeInPixels(nextSize: number) {
    const prevSize = store.groupSizeInPixels
    store.groupSizeInPixels = nextSize
    if (prevSize === nextSize) return
    if (prevSize == null || nextSize == null) return
    const { layout: prevLayout, panelDataArray } = store.eager
    if (prevLayout.length === 0) return
    if (!hasPixelSizedPanel(panelDataArray)) return
    const initSize = store.groupSizeAtLastLayoutInit
    if (initSize != null && initSize > 0 && initSize < 50 && nextSize > initSize * 10) {
      store.eager.panelDataArrayChanged = true
      setters.panelDataChanged()
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
  }

  function registerResizeHandle(dragHandleId: string) {
    return function resizeHandler(event: ResizeEvent) {
      event.preventDefault()
      const panelGroupElement = element.current
      if (!panelGroupElement) return
      const { direction, groupId, keyboardResizeBy, dir } = settings()
      const dragState = store.dragState
      const { layout: prevLayout, panelDataArray } = store.eager
      const { initialLayout } = dragState ?? {}
      const pivotIndices = determinePivotIndices(groupId, dragHandleId, panelGroupElement)
      let delta = calculateDeltaPercentage(
        event,
        dragHandleId,
        direction,
        dragState,
        keyboardResizeBy,
        panelGroupElement,
      )
      if (delta === 0) return
      const isHorizontal = direction === 'horizontal'
      if (dir === 'rtl' && isHorizontal) delta = -delta
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
      if (isMouseEvent(event) || isTouchEvent(event)) {
        if (store.prevDelta !== delta) {
          store.prevDelta = delta
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
          } else {
            reportConstraintsViolation(dragHandleId, 0)
          }
        }
      }
      if (layoutChanged) commitLayout(nextLayout, panelDataArray)
    }
  }

  function resizePanel(panelData: PanelData, unsafePanelSize: number) {
    const { layout: prevLayout, panelDataArray } = store.eager
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

  function isPanelCollapsed(panelData: PanelData) {
    const { layout, panelDataArray } = store.eager
    const panelConstraintsArray = getPanelConstraintsInPercent()
    const {
      collapsedSize = 0,
      collapsible,
      panelSize,
    } = panelDataHelper(panelDataArray, panelData, layout, panelConstraintsArray ?? undefined)
    if (!collapsible) return false
    if (panelSize === undefined) {
      const panelIndex = findPanelDataIndex(panelDataArray, panelData)
      const constraints = panelConstraintsArray?.[panelIndex] ?? panelData.constraints
      return constraints.defaultSize === constraints.collapsedSize
    } else {
      return fuzzyCompareNumbers(panelSize, collapsedSize) <= 0
    }
  }

  function reevaluatePanelConstraints(panelData: PanelData, _prevConstraints: PanelConstraints) {
    const { layout, panelDataArray } = store.eager
    const index = findPanelDataIndex(panelDataArray, panelData)
    panelDataArray[index] = panelData
    store.eager.panelDataArrayChanged = true
    setters.panelDataChanged()
    const panelConstraintsArray = getPanelConstraintsInPercent()
    if (!panelConstraintsArray) return
    const nextConstraints = panelConstraintsArray[index]
    const { panelSize: prevPanelSize } = panelDataHelper(
      panelDataArray,
      panelData,
      layout,
      panelConstraintsArray,
    )
    if (prevPanelSize === null) return
    const nextCollapsedSize = nextConstraints?.collapsedSize ?? 0
    const nextMaxSize = nextConstraints?.maxSize ?? 100
    const nextMinSize = nextConstraints?.minSize ?? 0
    if (nextConstraints?.collapsible && isPanelCollapsed(panelData)) {
      if (prevPanelSize !== nextCollapsedSize) resizePanel(panelData, nextCollapsedSize)
    } else if ((prevPanelSize as number) < nextMinSize) {
      resizePanel(panelData, nextMinSize)
    } else if ((prevPanelSize as number) > nextMaxSize) {
      resizePanel(panelData, nextMaxSize)
    }
  }

  function startDragging(dragHandleId: string, event: ResizeEvent) {
    const { direction } = settings()
    const { layout } = store.eager
    if (!element.current) return
    const handleElement = getResizeHandleElement(dragHandleId, element.current)
    assert(handleElement)
    const initialCursorPosition = getResizeEventCursorPosition(direction, event)
    store.dragState = {
      dragHandleId,
      dragHandleRect: handleElement.getBoundingClientRect(),
      initialCursorPosition,
      initialLayout: layout,
    }
    setters.dragState(store.dragState)
  }

  function stopDragging() {
    store.dragState = null
    setters.dragState(null)
  }

  function unregisterPanel(panelData: PanelData) {
    const { panelDataArray } = store.eager
    const index = findPanelDataIndex(panelDataArray, panelData)
    if (index >= 0) {
      panelDataArray.splice(index, 1)
      delete store.panelIdToLastNotifiedSizeMap[panelData.id]
      store.eager.panelDataArrayChanged = true
      setters.panelDataChanged()
    }
  }

  function updateAriaValues() {
    const panelGroupElement = element.current
    if (!panelGroupElement) return
    const panelDataArrayWithPercentConstraints = getPanelDataWithPercentConstraints()
    if (!panelDataArrayWithPercentConstraints) return
    const resizeHandleElements = getResizeHandleElementsForGroup(
      settings().groupId,
      panelGroupElement,
    )
    for (let index = 0; index < panelDataArrayWithPercentConstraints.length - 1; index++) {
      const { valueMax, valueMin, valueNow } = calculateAriaValues({
        layout: store.layout,
        panelsArray: panelDataArrayWithPercentConstraints,
        pivotIndices: [index, index + 1],
      })
      const resizeHandleElement = resizeHandleElements[index]
      if (resizeHandleElement != null) {
        const panelData = panelDataArrayWithPercentConstraints[index]
        assert(panelData)
        resizeHandleElement.setAttribute('aria-controls', panelData.id)
        resizeHandleElement.setAttribute('aria-valuemax', `${Math.round(valueMax)}`)
        resizeHandleElement.setAttribute('aria-valuemin', `${Math.round(valueMin)}`)
        resizeHandleElement.setAttribute(
          'aria-valuenow',
          valueNow != null ? `${Math.round(valueNow)}` : '',
        )
      }
    }
    return () => {
      resizeHandleElements.forEach(resizeHandleElement => {
        resizeHandleElement.removeAttribute('aria-controls')
        resizeHandleElement.removeAttribute('aria-valuemax')
        resizeHandleElement.removeAttribute('aria-valuemin')
        resizeHandleElement.removeAttribute('aria-valuenow')
      })
    }
  }

  function bindCollapseKeys() {
    const panelGroupElement = element.current
    if (!panelGroupElement) return
    const panelDataArrayWithPercentConstraints = getPanelDataWithPercentConstraints()
    if (!panelDataArrayWithPercentConstraints) return
    const { groupId } = settings()
    const { panelDataArray } = store.eager
    const groupElement = getPanelGroupElement(groupId, panelGroupElement)
    assert(groupElement != null, `No group found for id "${groupId}"`)
    const handles = getResizeHandleElementsForGroup(groupId, panelGroupElement)
    assert(handles)
    const cleanupFunctions = handles.map(handle => {
      const handleId = handle.getAttribute('data-panel-resize-handle-id')
      assert(handleId)
      const [idBefore, idAfter] = getResizeHandlePanelIds(
        groupId,
        handleId,
        panelDataArray,
        panelGroupElement,
      )
      if (idBefore == null || idAfter == null) return () => {}
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.defaultPrevented) return
        switch (event.key) {
          case 'Enter': {
            event.preventDefault()
            const index = panelDataArrayWithPercentConstraints.findIndex(
              panelData => panelData.id === idBefore,
            )
            if (index >= 0) {
              const panelData = panelDataArrayWithPercentConstraints[index]
              assert(panelData)
              const size = store.layout[index]
              const { collapsedSize = 0, collapsible, minSize = 0 } = panelData.constraints
              if (size != null && collapsible) {
                const nextLayout = adjustLayoutByDelta({
                  delta: fuzzyNumbersEqual(size, collapsedSize)
                    ? minSize - collapsedSize
                    : collapsedSize - size,
                  layout: store.layout,
                  panelConstraints: panelDataArrayWithPercentConstraints.map(
                    panelData => panelData.constraints,
                  ),
                  pivotIndices: determinePivotIndices(groupId, handleId, panelGroupElement),
                  trigger: 'keyboard',
                })
                if (store.layout !== nextLayout) setLayout(nextLayout)
              }
            }
            break
          }
        }
      }
      handle.addEventListener('keydown', onKeyDown)
      return () => {
        handle.removeEventListener('keydown', onKeyDown)
      }
    })
    return () => {
      cleanupFunctions.forEach(cleanupFunction => cleanupFunction())
    }
  }

  function save(debounceMap: Record<string, ReturnType<typeof debounce<SaveArgs>>>) {
    const { panelDataArray } = store.eager
    const { autoSaveId, storage } = settings()
    if (autoSaveId) {
      if (store.layout.length === 0 || store.layout.length !== panelDataArray.length) return
      let debouncedSave = debounceMap[autoSaveId]
      if (!debouncedSave) {
        debouncedSave = debounce<SaveArgs>(savePanelGroupState, LOCAL_STORAGE_DEBOUNCE_INTERVAL)
        debounceMap[autoSaveId] = debouncedSave
      }
      const clonedPanelDataArray = [...panelDataArray]
      const clonedPanelSizesBeforeCollapse = new Map(store.panelSizeBeforeCollapse)
      debouncedSave(
        autoSaveId,
        clonedPanelDataArray,
        clonedPanelSizesBeforeCollapse,
        store.layout,
        storage,
      )
    }
  }

  const api: PanelGroupApi = {
    getPanelStyle,
    isPanelCollapsed,
    reevaluatePanelConstraints,
    registerPanel,
    registerResizeHandle,
    resizePanel,
    startDragging,
    stopDragging,
    unregisterPanel,
  }

  return {
    api,
    bindCollapseKeys,
    processPanelDataArrayChange,
    save,
    setGroupSizeInPixels,
    updateAriaValues,
  }
}

type SaveArgs = Parameters<typeof savePanelGroupState>

export function SplitterGroup({
  id,
  autoSaveId = null,
  direction,
  keyboardResizeBy = 10,
  storage = defaultStorage,
  onLayout,
  as,
  asChild,
  style,
  children,
  ref,
  ...attrs
}: SplitterGroupProps) {
  const generatedId = useId()
  const groupId = id || `reka-splitter-group-${generatedId}`
  const dir = useDirection()
  const element = useRef<HTMLElement>(null)
  const composedRef = useComposedRefs(ref, element)
  const [layout, setLayout] = useState<number[]>([])
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [version, setVersion] = useState(0)
  const [groupSize, setGroupSize] = useState<number | null>(null)
  const latest = useRef<GroupSettings>({
    autoSaveId,
    direction,
    dir,
    groupId,
    keyboardResizeBy,
    storage,
    onLayout,
  })
  latest.current = { autoSaveId, direction, dir, groupId, keyboardResizeBy, storage, onLayout }
  const [group] = useState(() =>
    createPanelGroup(
      element,
      () => latest.current,
      {
        layout: [],
        eager: { layout: [], panelDataArray: [], panelDataArrayChanged: false },
        dragState: null,
        groupSizeInPixels: null,
        groupSizeAtLastLayoutInit: null,
        panelIdToLastNotifiedSizeMap: {},
        panelSizeBeforeCollapse: new Map(),
        prevDelta: 0,
      },
      {
        layout: setLayout,
        dragState: setDragState,
        panelDataChanged: () => setVersion(value => value + 1),
      },
    ),
  )
  const [debounceMap] = useState<Record<string, ReturnType<typeof debounce<SaveArgs>>>>(() => ({}))

  useLayoutEffect(() => {
    const el = element.current
    if (!el) return
    if (typeof ResizeObserver !== 'function') return
    const resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0]
      if (!entry) return
      const { height, width } = entry.contentRect
      const nextSize = latest.current.direction === 'horizontal' ? width : height
      if (!Number.isNaN(nextSize)) {
        group.setGroupSizeInPixels(nextSize)
        setGroupSize(nextSize)
      }
    })
    resizeObserver.observe(el)
    return () => resizeObserver.disconnect()
  }, [group])

  useLayoutEffect(() => {
    group.processPanelDataArrayChange()
  }, [group, version])

  useLayoutEffect(() => group.updateAriaValues(), [group, layout, version, groupSize])

  useEffect(() => group.bindCollapseKeys(), [group, version, groupSize])

  useEffect(() => {
    group.save(debounceMap)
  }, [group, debounceMap, layout, version, autoSaveId, storage])

  const context = useMemo<PanelGroupContextValue>(
    () => ({
      api: group.api,
      direction,
      dragState,
      groupId,
      layout,
      panelGroupElement: element,
      version,
    }),
    [group, direction, dragState, groupId, layout, version],
  )

  return (
    <PanelGroupContext value={context}>
      <Primitive
        ref={composedRef}
        as={as}
        asChild={asChild}
        data-panel-group=""
        data-orientation={direction}
        data-panel-group-id={groupId}
        {...attrs}
        style={
          {
            display: 'flex',
            flexDirection: direction === 'horizontal' ? 'row' : 'column',
            height: '100%',
            overflow: 'hidden',
            width: '100%',
            ...style,
          } as CSSProperties
        }
      >
        {children}
      </Primitive>
    </PanelGroupContext>
  )
}
