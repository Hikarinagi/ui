import { SearchInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-72">
      <SearchInput size="sm" defaultValue="星见" aria-label="小号" />
      <SearchInput size="md" defaultValue="星见" aria-label="中号" />
      <SearchInput size="lg" defaultValue="星见" aria-label="大号" />
    </Stack>
  )
}
