import { CheckboxGroup, Inline } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: '轻小说' },
]

export default function Demo() {
  return (
    <Inline gap="lg" align="start">
      <CheckboxGroup size="sm" options={options} value={['gal']} aria-label="小号" />
      <CheckboxGroup size="md" options={options} value={['gal']} aria-label="中号" />
      <CheckboxGroup size="lg" options={options} value={['gal']} aria-label="大号" />
    </Inline>
  )
}
