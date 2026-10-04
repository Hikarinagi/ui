import { Stack, TreeSelect } from '@hina-ui/react'
import { regions } from './data'

export default function Demo() {
  return (
    <Stack className="w-64">
      <TreeSelect size="sm" items={regions} value="tokyo" aria-label="小号" />
      <TreeSelect size="md" items={regions} value="tokyo" aria-label="中号" />
      <TreeSelect size="lg" items={regions} value="tokyo" aria-label="大号" />
    </Stack>
  )
}
