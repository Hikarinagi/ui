import { Stack, TreeSelect } from '@hina-ui/react'
import { regions } from './data'

export default function Demo() {
  return (
    <Stack className="w-64">
      <TreeSelect size="sm" items={regions} value="tokyo" aria-label="Small" />
      <TreeSelect size="md" items={regions} value="tokyo" aria-label="Medium" />
      <TreeSelect size="lg" items={regions} value="tokyo" aria-label="Large" />
    </Stack>
  )
}
