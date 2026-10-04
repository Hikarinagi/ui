import { MultiCombobox, Stack } from '@hina-ui/react'

const options = [
  { value: 1, label: 'Key' },
  { value: 2, label: 'Type-Moon' },
]

export default function Demo() {
  return (
    <Stack gap="sm" className="w-full max-w-sm">
      <MultiCombobox size="sm" options={options} defaultValue={[1]} aria-label="小号" />
      <MultiCombobox size="md" options={options} defaultValue={[1]} aria-label="中号" />
      <MultiCombobox size="lg" options={options} defaultValue={[1]} aria-label="大号" />
    </Stack>
  )
}
