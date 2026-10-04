'use client'

import { useState } from 'react'
import { Stepper, Stack, Switch } from '@hina-ui/react'

const items = [
  { title: '步骤 A', description: '第一项的说明' },
  { title: '步骤 B', description: '第二项包含更长的说明文字，支持自然换行' },
  { title: '步骤 C', description: '最后一项的说明' },
]

export default function Demo() {
  const [linear, setLinear] = useState(true)
  return (
    <Stack className="w-full" gap="lg">
      <Switch checked={linear} onCheckedChange={setLinear}>
        线性切换
      </Switch>
      <Stepper items={items} linear={linear} />
    </Stack>
  )
}
