export const LINE_CLAMP_DEFAULT = 3

export function lineClampCount(lines: number | undefined) {
  if (lines === undefined || !Number.isFinite(lines)) return LINE_CLAMP_DEFAULT
  return Math.max(1, Math.floor(lines))
}

export function measureLineClamp(content: HTMLElement, clampClass: string) {
  const missing = clampClass.split(/\s+/).filter(name => name && !content.classList.contains(name))
  content.classList.add(...missing)
  const truncated = content.scrollHeight - content.clientHeight > 1
  content.classList.remove(...missing)
  return truncated
}

export function revealLineClamp(root: HTMLElement | null) {
  root?.scrollIntoView?.({ block: 'nearest' })
}
