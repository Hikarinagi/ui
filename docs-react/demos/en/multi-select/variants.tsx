import { Card, MultiSelect, Stack } from '@hina-ui/react'

const options = [
  { value: 'school', label: 'School' },
  { value: 'sf', label: 'Sci-fi' },
]

export default function Demo() {
  return (
    <Stack className="w-72">
      <MultiSelect options={options} placeholder="Directly on the page" aria-label="On the page" />
      <Card>
        <MultiSelect
          variant="secondary"
          options={options}
          placeholder="Inside a card"
          aria-label="Inside a card"
        />
      </Card>
    </Stack>
  )
}
