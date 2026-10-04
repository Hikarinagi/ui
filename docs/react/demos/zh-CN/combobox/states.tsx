import { Combobox, Stack } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说' },
  { value: 'manga', label: '漫画', disabled: true },
]

export default function Demo() {
  return (
    <Stack className="w-64">
      <Combobox invalid options={options} placeholder="请选择类型" aria-label="校验未通过" />
      <Combobox disabled options={options} defaultValue="gal" aria-label="已禁用" />
    </Stack>
  )
}
