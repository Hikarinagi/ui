import { Card, Select, Stack } from '@hina-ui/react'

const options = [
  { value: 'gal', label: 'Galgame' },
  { value: 'ln', label: 'Light novel' },
]

export default function Demo() {
  return (
    <Stack className="w-56">
      <Select options={options} placeholder="Directly on the page" aria-label="On the page" />
      <Card>
        <Select
          variant="secondary"
          options={options}
          placeholder="Inside a card"
          aria-label="Inside a card"
        />
      </Card>
    </Stack>
  )
}
