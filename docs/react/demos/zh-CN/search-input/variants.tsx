import { SearchInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-full max-w-xs">
      <SearchInput variant="primary" aria-label="primary" placeholder="primary" />
      <SearchInput variant="secondary" aria-label="secondary" placeholder="secondary" />
      <SearchInput variant="bare" aria-label="bare" placeholder="bare" />
    </Stack>
  )
}
