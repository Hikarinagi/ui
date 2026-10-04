import { CheckboxGroup, Inline } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说' },
  { value: 'manga', label: '漫画', disabled: true },
]

export default function Demo() {
  return (
    <Inline gap="lg" align="start">
      <CheckboxGroup options={options} value={['gal']} aria-label="含禁用项" />
      <CheckboxGroup disabled options={options} value={['gal']} aria-label="整组禁用" />
      <CheckboxGroup invalid options={options} value={[]} aria-label="校验未通过" />
    </Inline>
  )
}
