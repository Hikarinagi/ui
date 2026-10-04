import { Combobox, Stack } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说' },
]

export default function Demo() {
  return (
    <Stack className="w-64">
      <Combobox size="sm" options={options} defaultValue="gal" aria-label="小号" />
      <Combobox size="md" options={options} defaultValue="gal" aria-label="中号" />
      <Combobox size="lg" options={options} defaultValue="gal" aria-label="大号" />
    </Stack>
  )
}
