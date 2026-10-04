import { CheckboxGroup, Inline } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: 'Light novel' },
  { value: 'manga', label: 'Manga', disabled: true },
]

export default function Demo() {
  return (
    <Inline gap="lg" align="start">
      <CheckboxGroup options={options} value={['gal']} aria-label="With a disabled option" />
      <CheckboxGroup disabled options={options} value={['gal']} aria-label="Disabled group" />
      <CheckboxGroup invalid options={options} value={[]} aria-label="Invalid" />
    </Inline>
  )
}
