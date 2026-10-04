import { MultiSelect, Stack } from '@hina-ui/react'

const options = [
  { value: 'school', label: '校园' },
  { value: 'sf', label: '科幻' },
  { value: 'romance', label: '恋爱' },
]

export default function Demo() {
  return (
    <Stack className="w-72">
      <MultiSelect
        invalid
        options={options}
        placeholder="至少选择一个标签"
        aria-label="校验未通过"
      />
      <MultiSelect disabled options={options} value={['school']} aria-label="已禁用" />
    </Stack>
  )
}
