const isBrowser = typeof document !== 'undefined'

export function getPanelGroupElement(
  id: string,
  rootElement: ParentNode | HTMLElement = document,
): HTMLElement | null {
  if (!isBrowser) return null
  if (rootElement instanceof HTMLElement && rootElement?.dataset?.panelGroupId === id)
    return rootElement
  const element = rootElement.querySelector<HTMLElement>(
    `[data-panel-group][data-panel-group-id="${id}"]`,
  )
  if (element) return element
  return null
}

export function getResizeHandleElement(
  id: string,
  scope: ParentNode | HTMLElement = document,
): HTMLElement | null {
  if (!isBrowser) return null
  const element = scope.querySelector<HTMLElement>(`[data-panel-resize-handle-id="${id}"]`)
  if (element) return element
  return null
}

export function getResizeHandleElementIndex(
  groupId: string,
  id: string,
  scope: ParentNode | HTMLElement = document,
): number | null {
  if (!isBrowser) return null
  const handles = getResizeHandleElementsForGroup(groupId, scope)
  const index = handles.findIndex(
    handle => handle.getAttribute('data-panel-resize-handle-id') === id,
  )
  return index ?? null
}

export function getResizeHandleElementsForGroup(
  groupId: string,
  scope: ParentNode | HTMLElement = document,
): HTMLElement[] {
  if (!isBrowser) return []
  return Array.from(
    scope.querySelectorAll<HTMLElement>(
      `[data-panel-resize-handle-id][data-panel-group-id="${groupId}"]`,
    ),
  )
}

export function getResizeHandlePanelIds(
  groupId: string,
  handleId: string,
  panelsArray: { id: string }[],
  scope: ParentNode | HTMLElement = document,
): [idBefore: string | null, idAfter: string | null] {
  const handle = getResizeHandleElement(handleId, scope)
  const handles = getResizeHandleElementsForGroup(groupId, scope)
  const index = handle ? handles.indexOf(handle) : -1
  const idBefore = panelsArray[index]?.id ?? null
  const idAfter = panelsArray[index + 1]?.id ?? null
  return [idBefore, idAfter]
}
