import { MultiSelect, Stack } from '@hina-ui/react'

const options = [
  { value: 'school', label: '校园' },
  { value: 'sf', label: '科幻' },
  { value: 'romance', label: '恋爱' },
]

export default function Demo() {
  return (
    <Stack className="w-72">
      <MultiSelect size="sm" options={options} value={['school', 'sf']} aria-label="小号" />
      <MultiSelect size="md" options={options} value={['school', 'sf']} aria-label="中号" />
      <MultiSelect size="lg" options={options} value={['school', 'sf']} aria-label="大号" />
    </Stack>
  )
}
