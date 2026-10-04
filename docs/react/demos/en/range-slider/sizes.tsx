import { RangeSlider, Stack } from '@hina-ui/react'

export default function Demo() {
  return (
    <Stack gap="sm" className="w-64">
      <RangeSlider size="sm" value={[20, 60]} aria-label="Small" />
      <RangeSlider size="md" value={[20, 60]} aria-label="Medium" />
      <RangeSlider size="lg" value={[20, 60]} aria-label="Large" />
    </Stack>
  )
}
