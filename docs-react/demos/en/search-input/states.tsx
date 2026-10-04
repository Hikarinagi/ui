import { SearchInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-72">
      <SearchInput disabled defaultValue="Spice" aria-label="Disabled" />
      <SearchInput clearable={false} defaultValue="Spice" aria-label="Without clear button" />
    </Stack>
  )
}
