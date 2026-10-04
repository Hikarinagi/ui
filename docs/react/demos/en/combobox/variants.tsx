import { Card, Combobox, Stack } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: 'Light novel' },
]

export default function Demo() {
  return (
    <Stack className="w-64">
      <Combobox options={options} placeholder="Directly on the page" aria-label="On the page" />
      <Card>
        <Combobox
          variant="secondary"
          options={options}
          placeholder="Inside a card"
          aria-label="Inside a card"
        />
      </Card>
    </Stack>
  )
}
