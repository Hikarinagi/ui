import { MultiSelect, Stack } from '@hina-ui/react'

const options = [
  { value: 'school', label: 'School' },
  { value: 'sf', label: 'Sci-fi' },
  { value: 'romance', label: 'Romance' },
]

export default function Demo() {
  return (
    <Stack className="w-72">
      <MultiSelect size="sm" options={options} value={['school', 'sf']} aria-label="Small" />
      <MultiSelect size="md" options={options} value={['school', 'sf']} aria-label="Medium" />
      <MultiSelect size="lg" options={options} value={['school', 'sf']} aria-label="Large" />
    </Stack>
  )
}
