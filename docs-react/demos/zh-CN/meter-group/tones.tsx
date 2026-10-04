import { MeterGroup, type MeterItem } from '@hina-ui/react'

const items: MeterItem[] = [
  { label: '通过', value: 62, tone: 'success' },
  { label: '待定', value: 21, tone: 'warning' },
  { label: '退回', value: 9, tone: 'danger' },
]

export default function Demo() {
  return <MeterGroup label="审核结果" items={items} className="w-96" />
}
