import { PinInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm" align="start">
      <PinInput length={4} value="1234" invalid aria-label="Invalid" />
      <PinInput length={4} value="1234" disabled aria-label="Disabled" />
      <PinInput length={4} value="1234" variant="secondary" aria-label="Secondary" />
    </Stack>
  )
}
