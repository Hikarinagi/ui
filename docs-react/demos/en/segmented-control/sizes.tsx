import { SegmentedControl, Stack } from '@hina-ui/react'

const options = [
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

export default function Demo() {
  return (
    <Stack gap="sm" align="start">
      <SegmentedControl size="sm" options={options} value="day" aria-label="Small" />
      <SegmentedControl size="md" options={options} value="day" aria-label="Medium" />
      <SegmentedControl size="lg" options={options} value="day" aria-label="Large" />
    </Stack>
  )
}
