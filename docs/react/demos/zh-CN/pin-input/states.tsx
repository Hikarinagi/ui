import { PinInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm" align="start">
      <PinInput length={4} value="1234" invalid aria-label="校验未通过" />
      <PinInput length={4} value="1234" disabled aria-label="已禁用" />
      <PinInput length={4} value="1234" variant="secondary" aria-label="扁平形态" />
    </Stack>
  )
}
