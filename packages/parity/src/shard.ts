const [part, total] = (import.meta.env.HINA_PARITY_SHARD ?? '1/1').split('/').map(Number)

export function inShard<T>(entries: T[]) {
  return entries.filter((_, index) => index % total === part - 1)
}
