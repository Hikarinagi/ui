'use client'

import { useState } from 'react'
import { Stack, Text, TreeSelect, type TreeSelectValue } from '@hina-ui/react'
import { regions } from './data'

export default function Demo() {
  const [region, setRegion] = useState<TreeSelectValue>(null)

  return (
    <Stack className="w-64">
      <TreeSelect
        value={region}
        onValueChange={setRegion}
        items={regions}
        placeholder="选择地区"
        aria-label="地区"
      />
      <Text tone="muted">当前值：{region ?? '无'}</Text>
    </Stack>
  )
}
