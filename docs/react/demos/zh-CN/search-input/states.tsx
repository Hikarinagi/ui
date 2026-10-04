import { SearchInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-72">
      <SearchInput disabled defaultValue="星见" aria-label="已禁用" />
      <SearchInput clearable={false} defaultValue="星见" aria-label="不带清除按钮" />
    </Stack>
  )
}
