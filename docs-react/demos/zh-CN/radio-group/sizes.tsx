import { Inline, RadioGroup } from '@hina-ui/react'

const options = [
  { value: 'wish', label: '想看' },
  { value: 'doing', label: '在看' },
]

export default function Demo() {
  return (
    <Inline gap="lg" align="start">
      <RadioGroup size="sm" options={options} value="wish" aria-label="小号" />
      <RadioGroup size="md" options={options} value="wish" aria-label="中号" />
      <RadioGroup size="lg" options={options} value="wish" aria-label="大号" />
    </Inline>
  )
}
