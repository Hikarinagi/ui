import { Inline, RadioGroup } from '@hina-ui/react'

const options = [
  { value: 'wish', label: '想看' },
  { value: 'doing', label: '在看' },
  { value: 'done', label: '看过', disabled: true },
]

export default function Demo() {
  return (
    <Inline gap="lg" align="start">
      <RadioGroup options={options} value="wish" aria-label="含禁用项" />
      <RadioGroup disabled options={options} value="wish" aria-label="整组禁用" />
      <RadioGroup invalid options={options} aria-label="校验未通过" />
    </Inline>
  )
}
