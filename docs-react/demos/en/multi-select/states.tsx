import { MultiSelect, Stack } from '@hina-ui/react'

const options = [
  { value: 'school', label: 'School' },
  { value: 'sf', label: 'Sci-fi' },
  { value: 'romance', label: 'Romance' },
]

export default function Demo() {
  return (
    <Stack className="w-72">
      <MultiSelect
        invalid
        options={options}
        placeholder="Choose at least one tag"
        aria-label="Invalid"
      />
      <MultiSelect disabled options={options} value={['school']} aria-label="Disabled" />
    </Stack>
  )
}
