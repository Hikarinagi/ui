import { MeterGroup, type MeterItem } from '@hina-ui/react'

const items: MeterItem[] = [
  { label: 'Approved', value: 62, tone: 'success' },
  { label: 'Pending', value: 21, tone: 'warning' },
  { label: 'Returned', value: 9, tone: 'danger' },
]

export default function Demo() {
  return <MeterGroup label="Review results" items={items} className="w-96" />
}
