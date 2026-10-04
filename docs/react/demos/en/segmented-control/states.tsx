import { SegmentedControl, Stack } from '@hina-ui/react'

const options = [
  { value: 'all', label: 'All' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'done', label: 'Completed' },
]
const partial = [
  { value: 'all', label: 'All' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'done', label: 'Completed', disabled: true },
]

export default function Demo() {
  return (
    <Stack gap="sm" align="start">
      <SegmentedControl options={options} value="all" disabled aria-label="Group disabled" />
      <SegmentedControl options={partial} value="all" aria-label="One item disabled" />
    </Stack>
  )
}
