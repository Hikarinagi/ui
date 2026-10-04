import { Card, Stack, TreeSelect } from '@hina-ui/react'
import { regions } from './data'

export default function Demo() {
  return (
    <Stack className="w-64">
      <TreeSelect items={regions} placeholder="Directly on the page" aria-label="On the page" />
      <Card>
        <TreeSelect
          variant="secondary"
          items={regions}
          placeholder="Inside a card"
          aria-label="Inside a card"
        />
      </Card>
    </Stack>
  )
}
