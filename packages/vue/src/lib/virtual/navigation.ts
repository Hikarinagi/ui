export function nextEnabled(
  length: number,
  from: number,
  step: number,
  disabled: (index: number) => boolean,
) {
  for (let index = from; index >= 0 && index < length; index += step)
    if (!disabled(index)) return index
  return -1
}

export function typeaheadMatch(
  labels: readonly string[],
  query: string,
  current: number,
  disabled: (index: number) => boolean,
) {
  const normalized = query.toLocaleLowerCase()
  const repeated = [...normalized].every(char => char === normalized[0])
  const search = repeated ? normalized[0]! : normalized
  for (let offset = repeated ? 1 : 0; offset <= labels.length; offset++) {
    const index = (Math.max(0, current) + offset) % labels.length
    if (!disabled(index) && labels[index]?.toLocaleLowerCase().startsWith(search)) return index
  }
  return -1
}
