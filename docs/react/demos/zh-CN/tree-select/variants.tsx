import { Card, Stack, TreeSelect } from '@hina-ui/react'
import { regions } from './data'

export default function Demo() {
  return (
    <Stack className="w-64">
      <TreeSelect items={regions} placeholder="直接放在页面上" aria-label="页面上的选择框" />
      <Card>
        <TreeSelect
          variant="secondary"
          items={regions}
          placeholder="放在卡片内"
          aria-label="卡片内的选择框"
        />
      </Card>
    </Stack>
  )
}
