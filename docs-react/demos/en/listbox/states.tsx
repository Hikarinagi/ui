import { Listbox, Stack } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: 'Light novel' },
  { value: 'manga', label: 'Manga', disabled: true },
]

export default function Demo() {
  return (
    <Stack className="w-56">
      <Listbox options={options} value="gal" aria-label="With a disabled option" />
      <Listbox disabled options={options} value="gal" aria-label="Disabled" />
    </Stack>
  )
}
