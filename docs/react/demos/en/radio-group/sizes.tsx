import { Inline, RadioGroup } from '@hina-ui/react'

const options = [
  { value: 'wish', label: 'Want to read' },
  { value: 'doing', label: 'Reading' },
]

export default function Demo() {
  return (
    <Inline gap="lg" align="start">
      <RadioGroup size="sm" options={options} value="wish" aria-label="Small" />
      <RadioGroup size="md" options={options} value="wish" aria-label="Medium" />
      <RadioGroup size="lg" options={options} value="wish" aria-label="Large" />
    </Inline>
  )
}
