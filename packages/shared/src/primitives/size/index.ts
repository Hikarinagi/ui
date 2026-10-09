export interface Size {
  width: number
  height: number
}

export function measureSize(element: HTMLElement): Size {
  return { width: element.offsetWidth, height: element.offsetHeight }
}

export function observeSize(element: HTMLElement, onChange: (size: Size) => void) {
  const observer = new ResizeObserver(entries => {
    if (!Array.isArray(entries) || !entries.length) return
    const entry = entries[0]!
    const border = Array.isArray(entry.borderBoxSize) ? entry.borderBoxSize[0] : entry.borderBoxSize
    onChange(border ? { width: border.inlineSize, height: border.blockSize } : measureSize(element))
  })
  observer.observe(element, { box: 'border-box' })
  return () => observer.disconnect()
}
