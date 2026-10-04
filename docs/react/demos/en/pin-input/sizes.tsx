import { PinInput, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm" align="start">
      <PinInput size="sm" length={4} value="2048" aria-label="Small" />
      <PinInput size="md" length={4} value="2048" aria-label="Medium" />
      <PinInput size="lg" length={4} value="2048" aria-label="Large" />
    </Stack>
  )
}
