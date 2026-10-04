import { MeterGroup, type MeterItem } from '@hina-ui/react'

const items: MeterItem[] = [
  { label: '已读', value: 56 },
  { label: '在读', value: 19 },
  { label: '想读', value: 12 },
]

export default function Demo() {
  return <MeterGroup label="今年的书" items={items} className="w-96" />
}
