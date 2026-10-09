export function composeEventHandlers<E extends { defaultPrevented: boolean }>(
  original?: (event: E) => void,
  ours?: (event: E) => void,
  { checkForDefaultPrevented = true } = {},
) {
  return function handleEvent(event: E) {
    original?.(event)
    if (!checkForDefaultPrevented || !event?.defaultPrevented) return ours?.(event)
  }
}
