import { Input, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-72">
      <Input invalid defaultValue="shion@" aria-label="Invalid" />
      <Input disabled defaultValue="hoshimi" aria-label="Disabled" />
    </Stack>
  )
}
