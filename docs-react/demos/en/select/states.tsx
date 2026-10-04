import { Select, Stack } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: 'Light novel' },
  { value: 'manga', label: 'Manga', disabled: true },
]

export default function Demo() {
  return (
    <Stack className="w-56">
      <Select invalid options={options} placeholder="Choose a type" aria-label="Invalid" />
      <Select disabled options={options} value="gal" aria-label="Disabled" />
      <Select options={[]} placeholder="Nothing to choose" aria-label="Empty list" />
    </Stack>
  )
}
