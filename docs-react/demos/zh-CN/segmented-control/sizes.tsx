import { SegmentedControl, Stack } from '@hina-ui/react'

const options = [
  { value: 'day', label: '日' },
  { value: 'week', label: '周' },
  { value: 'month', label: '月' },
]

export default function Demo() {
  return (
    <Stack gap="sm" align="start">
      <SegmentedControl size="sm" options={options} value="day" aria-label="小号" />
      <SegmentedControl size="md" options={options} value="day" aria-label="中号" />
      <SegmentedControl size="lg" options={options} value="day" aria-label="大号" />
    </Stack>
  )
}
