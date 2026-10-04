import { Select, Stack } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说' },
  { value: 'manga', label: '漫画', disabled: true },
]

export default function Demo() {
  return (
    <Stack className="w-56">
      <Select invalid options={options} placeholder="请选择类型" aria-label="校验未通过" />
      <Select disabled options={options} value="gal" aria-label="已禁用" />
      <Select options={[]} placeholder="没有可选项" aria-label="空列表" />
    </Stack>
  )
}
