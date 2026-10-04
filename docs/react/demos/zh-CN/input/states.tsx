import { Input, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-72">
      <Input invalid defaultValue="shion@" aria-label="校验未通过" />
      <Input disabled defaultValue="hoshimi" aria-label="已禁用" />
    </Stack>
  )
}
