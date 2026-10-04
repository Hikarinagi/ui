import { Select, Stack } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: 'Light novel' },
]

export default function Demo() {
  return (
    <Stack className="w-56">
      <Select size="sm" options={options} value="gal" aria-label="Small" />
      <Select size="md" options={options} value="gal" aria-label="Medium" />
      <Select size="lg" options={options} value="gal" aria-label="Large" />
    </Stack>
  )
}
