export function starFill(value: number, index: number) {
  const portion = Math.min(Math.max(value - (index - 1), 0), 1)
  return `${Math.round(portion * 1000) / 10}%`
}
