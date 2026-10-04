import { Stepper } from '@hina-ui/react'

const items = [
  { title: '步骤 A', description: '第一项的说明' },
  { title: '步骤 B', description: '第二项包含更长的说明文字，支持自然换行' },
  { title: '步骤 C', description: '最后一项的说明' },
]

export default function Demo() {
  return <Stepper items={items} defaultValue={2} orientation="vertical" className="max-w-md" />
}
