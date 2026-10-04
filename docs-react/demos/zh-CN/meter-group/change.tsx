'use client'

import { useState } from 'react'
import { Button, MeterGroup, Stack, type MeterItem } from '@hina-ui/react'

const labels = ['文档', '图片', '视频', '其他']
const sets = [
  [42, 27, 13, 8],
  [12, 36, 31, 6],
  [25, 8, 48, 14],
]

export default function Demo() {
  const [index, setIndex] = useState(0)

  const items: MeterItem[] = labels.map((label, i) => ({ label, value: sets[index]![i]! }))

  return (
    <Stack gap="md" align="start" className="w-96">
      <MeterGroup label="存储空间" items={items} className="w-full" />
      <Button
        size="sm"
        variant="soft"
        tone="neutral"
        onClick={() => setIndex((index + 1) % sets.length)}
      >
        换一组数据
      </Button>
    </Stack>
  )
}
