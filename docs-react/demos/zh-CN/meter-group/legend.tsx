import { MeterGroup, type MeterItem } from '@hina-ui/react'

const items: MeterItem[] = [
  { label: '文档', value: 42 },
  { label: '图片', value: 27 },
  { label: '视频', value: 13 },
]

export default function Demo() {
  return <MeterGroup label="存储空间" items={items} legend={false} className="w-96" />
}
