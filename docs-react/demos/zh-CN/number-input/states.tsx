import { NumberInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack className="w-40">
      <NumberInput invalid defaultValue={120} max={99} aria-label="校验未通过" />
      <NumberInput disabled defaultValue={3} aria-label="已禁用" />
      <NumberInput readonly defaultValue={3} aria-label="只读" />
    </Stack>
  )
}
