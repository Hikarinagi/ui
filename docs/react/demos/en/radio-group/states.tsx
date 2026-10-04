import { Inline, RadioGroup } from '@hina-ui/react'

const options = [
  { value: 'wish', label: 'Want to read' },
  { value: 'doing', label: 'Reading' },
  { value: 'done', label: 'Finished', disabled: true },
]

export default function Demo() {
  return (
    <Inline gap="lg" align="start">
      <RadioGroup options={options} value="wish" aria-label="With a disabled option" />
      <RadioGroup disabled options={options} value="wish" aria-label="Disabled group" />
      <RadioGroup invalid options={options} aria-label="Invalid" />
    </Inline>
  )
}
