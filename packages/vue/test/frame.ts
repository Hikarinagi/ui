export function frameRect(element: HTMLElement): DOMRect {
  const width = Number.parseFloat(element.style.width)
  const height = Number.parseFloat(element.style.height)
  const x = Number.parseFloat(element.style.left) + width / 2
  const y = Number.parseFloat(element.style.top) + height / 2
  const matrix = new DOMMatrix(element.style.transform)
  const corners = [
    [-width / 2, -height / 2],
    [width / 2, -height / 2],
    [width / 2, height / 2],
    [-width / 2, height / 2],
  ].map(([x, y]) => matrix.transformPoint({ x, y }))
  const left = Math.min(...corners.map(point => point.x))
  const top = Math.min(...corners.map(point => point.y))
  const right = Math.max(...corners.map(point => point.x))
  const bottom = Math.max(...corners.map(point => point.y))
  return new DOMRect(x + left, y + top, right - left, bottom - top)
}
