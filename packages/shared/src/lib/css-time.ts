export function cssTimeToMs(value: string) {
  const text = value.trim().toLowerCase()
  const amount = Number.parseFloat(text)
  if (!Number.isFinite(amount) || amount < 0) return 0
  return text.endsWith('s') && !text.endsWith('ms') ? amount * 1000 : amount
}
