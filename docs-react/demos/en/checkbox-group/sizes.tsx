import { CheckboxGroup, Inline } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: 'Light novel' },
]

export default function Demo() {
  return (
    <Inline gap="lg" align="start">
      <CheckboxGroup size="sm" options={options} value={['gal']} aria-label="Small" />
      <CheckboxGroup size="md" options={options} value={['gal']} aria-label="Medium" />
      <CheckboxGroup size="lg" options={options} value={['gal']} aria-label="Large" />
    </Inline>
  )
}
