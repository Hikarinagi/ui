import { MeterGroup, type MeterItem } from '@hina-ui/react'

const items: MeterItem[] = [
  { label: 'Read', value: 56 },
  { label: 'Reading', value: 19 },
  { label: 'To read', value: 12 },
]

export default function Demo() {
  return <MeterGroup label="This year's books" items={items} className="w-96" />
}
