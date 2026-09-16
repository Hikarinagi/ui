import { computed, type Ref } from 'vue'

export function useRatingScale(
  model: Ref<number>,
  max: () => number,
  stars: () => number | undefined,
) {
  const count = computed(() => stars() ?? max())
  const scaled = computed(() => count.value !== max())

  function toScore(value: number) {
    return scaled.value ? Number(((value / count.value) * max()).toPrecision(15)) : value
  }

  const value = computed({
    get: () =>
      scaled.value ? Number(((model.value / max()) * count.value).toFixed(10)) : model.value,
    set: (value: number) => {
      model.value = toScore(value)
    },
  })

  return { count, scaled, value, toScore }
}
