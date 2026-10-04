import { Combobox, Stack } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: 'Light novel' },
]

export default function Demo() {
  return (
    <Stack className="w-64">
      <Combobox size="sm" options={options} defaultValue="gal" aria-label="Small" />
      <Combobox size="md" options={options} defaultValue="gal" aria-label="Medium" />
      <Combobox size="lg" options={options} defaultValue="gal" aria-label="Large" />
    </Stack>
  )
}
