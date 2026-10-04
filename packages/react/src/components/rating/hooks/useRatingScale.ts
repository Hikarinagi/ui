export function useRatingScale(
  model: number,
  setModel: (value: number) => void,
  max: number,
  stars: number | undefined,
) {
  const count = stars ?? max
  const scaled = count !== max

  function toScore(value: number) {
    return scaled ? Number(((value / count) * max).toPrecision(15)) : value
  }

  const value = scaled ? Number(((model / max) * count).toFixed(10)) : model

  function setValue(next: number) {
    setModel(toScore(next))
  }

  return { count, scaled, value, setValue, toScore }
}
