import { SearchInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-72">
      <SearchInput size="sm" defaultValue="Spice" aria-label="Small" />
      <SearchInput size="md" defaultValue="Spice" aria-label="Medium" />
      <SearchInput size="lg" defaultValue="Spice" aria-label="Large" />
    </Stack>
  )
}
