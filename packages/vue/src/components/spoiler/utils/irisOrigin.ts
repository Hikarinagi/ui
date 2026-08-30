export interface IrisOrigin {
  x: number
  y: number
}

export function irisOrigin(
  rects: readonly DOMRect[],
  clientX: number,
  clientY: number,
): IrisOrigin | null {
  const valid = rects.filter(r => r.width > 0 && r.height > 0)
  if (valid.length === 0) return null

  const totalWidth = valid.reduce((sum, r) => sum + r.width, 0)
  const lineHeight = valid[0]!.height

  let virtualX: number | null = null
  let virtualY = 0
  let walked = 0
  for (const r of valid) {
    const inside =
      clientY >= r.top - 2 &&
      clientY <= r.bottom + 2 &&
      clientX >= r.left - 2 &&
      clientX <= r.right + 2
    if (inside) {
      virtualX = walked + (clientX - r.left)
      virtualY = clientY - r.top
      break
    }
    walked += r.width
  }

  if (virtualX === null || totalWidth === 0 || lineHeight === 0) return null

  return {
    x: (virtualX / totalWidth) * 100,
    y: (virtualY / lineHeight) * 100,
  }
}
