import { Input, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-72">
      <Input size="sm" aria-label="小号" placeholder="小号" />
      <Input size="md" aria-label="中号" placeholder="中号" />
      <Input size="lg" aria-label="大号" placeholder="大号" />
    </Stack>
  )
}
