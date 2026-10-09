import { watchEffect, type Ref } from 'vue'
import { assert } from '../../../../shared/src/primitives/splitter/assert'
import { calculateAriaValues } from '../../../../shared/src/primitives/splitter/calculate'
import { fuzzyNumbersEqual } from '../../../../shared/src/primitives/splitter/compare'
import {
  getPanelGroupElement,
  getResizeHandleElement,
  getResizeHandleElementIndex,
  getResizeHandleElementsForGroup,
  getResizeHandlePanelIds,
} from '../../../../shared/src/primitives/splitter/dom'
import { adjustLayoutByDelta } from '../../../../shared/src/primitives/splitter/layout'
import { determinePivotIndices } from '../../../../shared/src/primitives/splitter/pivot'
import type { PanelData, ResizeHandler } from '../../../../shared/src/primitives/splitter/types'

export interface EagerValues {
  layout: number[]
  panelDataArray: PanelData[]
  panelDataArrayChanged: boolean
}

export function useWindowSplitterPanelGroupBehavior({
  eagerValuesRef,
  groupId,
  layout,
  panelGroupElement,
  setLayout,
  getPanelDataWithPercentConstraints,
}: {
  eagerValuesRef: Ref<EagerValues>
  groupId: string
  layout: Ref<number[]>
  panelGroupElement: Ref<ParentNode | null | undefined>
  setLayout: (value: number[]) => void
  getPanelDataWithPercentConstraints: () => PanelData[] | null
}) {
  watchEffect(onCleanup => {
    const groupElement = panelGroupElement.value
    if (!groupElement) return
    const panels = getPanelDataWithPercentConstraints()
    if (!panels) return
    const handles = getResizeHandleElementsForGroup(groupId, groupElement)
    for (let index = 0; index < panels.length - 1; index++) {
      const { valueMax, valueMin, valueNow } = calculateAriaValues({
        layout: layout.value,
        panelsArray: panels,
        pivotIndices: [index, index + 1],
      })
      const handle = handles[index]
      if (handle != null) {
        const panelData = panels[index]
        assert(panelData)
        handle.setAttribute('aria-controls', panelData.id)
        handle.setAttribute('aria-valuemax', `${Math.round(valueMax)}`)
        handle.setAttribute('aria-valuemin', `${Math.round(valueMin)}`)
        handle.setAttribute('aria-valuenow', valueNow != null ? `${Math.round(valueNow)}` : '')
      }
    }
    onCleanup(() => {
      handles.forEach(handle => {
        handle.removeAttribute('aria-controls')
        handle.removeAttribute('aria-valuemax')
        handle.removeAttribute('aria-valuemin')
        handle.removeAttribute('aria-valuenow')
      })
    })
  })

  watchEffect(onCleanup => {
    const groupElement = panelGroupElement.value
    if (!groupElement) return
    const eagerValues = eagerValuesRef.value
    assert(eagerValues)
    const panels = getPanelDataWithPercentConstraints()
    if (!panels) return
    const { panelDataArray } = eagerValues
    assert(
      getPanelGroupElement(groupId, groupElement) != null,
      `No group found for id "${groupId}"`,
    )
    const handles = getResizeHandleElementsForGroup(groupId, groupElement)
    assert(handles)
    const cleanups = handles.map(handle => {
      const handleId = handle.getAttribute('data-panel-resize-handle-id')
      assert(handleId)
      const [idBefore, idAfter] = getResizeHandlePanelIds(
        groupId,
        handleId,
        panelDataArray,
        groupElement,
      )
      if (idBefore == null || idAfter == null) return () => {}
      const onKeyDown = (event: KeyboardEvent) => {
        if (event.defaultPrevented) return
        if (event.key !== 'Enter') return
        event.preventDefault()
        const index = panels.findIndex(panelData => panelData.id === idBefore)
        if (index < 0) return
        const panelData = panels[index]
        assert(panelData)
        const size = layout.value[index]
        const { collapsedSize = 0, collapsible, minSize = 0 } = panelData.constraints
        if (size == null || !collapsible) return
        const nextLayout = adjustLayoutByDelta({
          delta: fuzzyNumbersEqual(size, collapsedSize)
            ? minSize - collapsedSize
            : collapsedSize - size,
          layout: layout.value,
          panelConstraints: panels.map(panel => panel.constraints),
          pivotIndices: determinePivotIndices(groupId, handleId, groupElement),
          trigger: 'keyboard',
        })
        if (layout.value !== nextLayout) setLayout(nextLayout)
      }
      handle.addEventListener('keydown', onKeyDown)
      return () => handle.removeEventListener('keydown', onKeyDown)
    })
    onCleanup(() => cleanups.forEach(cleanup => cleanup()))
  })
}

export function useWindowSplitterResizeHandlerBehavior({
  disabled,
  handleId,
  resizeHandler,
  panelGroupElement,
}: {
  disabled: Ref<boolean>
  handleId: string
  resizeHandler: Ref<ResizeHandler | null>
  panelGroupElement: Ref<ParentNode | null | undefined>
}) {
  watchEffect(onCleanup => {
    const groupElement = panelGroupElement.value
    if (disabled.value || resizeHandler.value === null || groupElement === null) return
    const handleElement = getResizeHandleElement(handleId, groupElement)
    if (handleElement == null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return
      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
        case 'ArrowUp':
        case 'End':
        case 'Home': {
          event.preventDefault()
          resizeHandler.value?.(event)
          break
        }
        case 'F6': {
          event.preventDefault()
          const groupId = handleElement.getAttribute('data-panel-group-id')
          assert(groupId)
          const handles = getResizeHandleElementsForGroup(groupId, groupElement)
          const index = getResizeHandleElementIndex(groupId, handleId, groupElement)
          assert(index !== null)
          const nextIndex = event.shiftKey
            ? index > 0
              ? index - 1
              : handles.length - 1
            : index + 1 < handles.length
              ? index + 1
              : 0
          handles[nextIndex]!.focus()
          break
        }
      }
    }
    handleElement.addEventListener('keydown', onKeyDown)
    onCleanup(() => handleElement.removeEventListener('keydown', onKeyDown))
  })
}
