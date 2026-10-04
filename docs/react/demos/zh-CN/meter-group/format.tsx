'use client'

import { MeterGroup, type MeterItem } from '@hina-ui/react'

const items: MeterItem[] = [
  { label: '文档', value: 38 },
  { label: '图片', value: 24 },
  { label: '视频', value: 46 },
]

const format = (value: number) => `${value} GB`

export default function Demo() {
  return <MeterGroup label="存储空间" items={items} max={256} format={format} className="w-96" />
}
