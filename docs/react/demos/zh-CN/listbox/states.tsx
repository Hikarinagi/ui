import { Listbox, Stack } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说' },
  { value: 'manga', label: '漫画', disabled: true },
]

export default function Demo() {
  return (
    <Stack className="w-56">
      <Listbox options={options} value="gal" aria-label="含禁用项" />
      <Listbox disabled options={options} value="gal" aria-label="已禁用" />
    </Stack>
  )
}
