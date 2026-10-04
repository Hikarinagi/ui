import { MultiCombobox, Stack } from '@hina-ui/react'

const options = [
  { value: 1, label: 'Key' },
  { value: 2, label: 'Type-Moon' },
]

export default function Demo() {
  return (
    <Stack gap="sm" className="w-full max-w-sm">
      <MultiCombobox options={options} defaultValue={[1]} invalid aria-label="校验未通过" />
      <MultiCombobox options={options} defaultValue={[1]} disabled aria-label="已禁用" />
      <MultiCombobox
        options={options}
        defaultValue={[1]}
        variant="secondary"
        aria-label="扁平形态"
      />
    </Stack>
  )
}
