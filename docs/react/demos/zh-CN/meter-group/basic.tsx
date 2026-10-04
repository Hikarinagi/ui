import { MeterGroup, type MeterItem } from '@hina-ui/react'

const items: MeterItem[] = [
  { label: '已读', value: 56 },
  { label: '在读', value: 19 },
]

export default function Demo() {
  return <MeterGroup items={items} className="w-96" />
}
