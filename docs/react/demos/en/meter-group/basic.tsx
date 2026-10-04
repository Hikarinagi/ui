import { MeterGroup, type MeterItem } from '@hina-ui/react'

const items: MeterItem[] = [
  { label: 'Read', value: 56 },
  { label: 'Reading', value: 19 },
]

export default function Demo() {
  return <MeterGroup items={items} className="w-96" />
}
