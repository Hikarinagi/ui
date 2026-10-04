'use client'

import { MeterGroup, type MeterItem } from '@hina-ui/react'

const items: MeterItem[] = [
  { label: 'Documents', value: 38 },
  { label: 'Photos', value: 24 },
  { label: 'Videos', value: 46 },
]

const format = (value: number) => `${value} GB`

export default function Demo() {
  return <MeterGroup label="Storage" items={items} max={256} format={format} className="w-96" />
}
