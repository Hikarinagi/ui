export function getLabelText(id: string | undefined, element: Element | null | undefined) {
  if (!id || !element) return undefined
  return element.ownerDocument.querySelector<HTMLElement>(`[for="${id}"]`)?.innerText
}
