import { MeterGroup, type MeterItem } from '@hina-ui/react'

const items: MeterItem[] = [
  { label: 'Documents', value: 42 },
  { label: 'Photos', value: 27 },
  { label: 'Videos', value: 13 },
]

export default function Demo() {
  return <MeterGroup label="Storage" items={items} legend={false} className="w-96" />
}
