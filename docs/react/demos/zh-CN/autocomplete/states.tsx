import { Autocomplete, FormField, Stack } from '@hina-ui/react'

const options = [
  { value: 'http', label: 'entry:http' },
  { value: 'rpc', label: 'entry:rpc' },
]

export default function Demo() {
  return (
    <Stack className="w-full max-w-sm" gap="lg">
      <FormField label="小号">
        <Autocomplete options={options} size="sm" placeholder="输入查询" />
      </FormField>
      <FormField label="次级形态">
        <Autocomplete options={options} variant="secondary" placeholder="输入查询" />
      </FormField>
      <FormField label="大号">
        <Autocomplete options={options} size="lg" placeholder="输入查询" />
      </FormField>
      <FormField label="校验失败" error="请输入状态值。">
        <Autocomplete options={[]} defaultValue="status:" />
      </FormField>
      <FormField label="只读">
        <Autocomplete options={options} defaultValue="entry:http" readonly />
      </FormField>
      <FormField label="禁用" disabled>
        <Autocomplete options={options} defaultValue="entry:http" />
      </FormField>
    </Stack>
  )
}
