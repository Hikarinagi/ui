import { Combobox, Stack } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: 'Light novel' },
  { value: 'manga', label: 'Manga', disabled: true },
]

export default function Demo() {
  return (
    <Stack className="w-64">
      <Combobox invalid options={options} placeholder="Choose a type" aria-label="Invalid" />
      <Combobox disabled options={options} defaultValue="gal" aria-label="Disabled" />
    </Stack>
  )
}
