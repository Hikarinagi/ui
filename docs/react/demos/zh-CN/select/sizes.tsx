import { Select, Stack } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说' },
]

export default function Demo() {
  return (
    <Stack className="w-56">
      <Select size="sm" options={options} value="gal" aria-label="小号" />
      <Select size="md" options={options} value="gal" aria-label="中号" />
      <Select size="lg" options={options} value="gal" aria-label="大号" />
    </Stack>
  )
}
