import { Stepper } from '@hina-ui/react'

const items = [
  { title: 'الخطوة الأولى', description: 'وصف الخطوة الأولى' },
  { title: 'الخطوة الثانية', description: 'وصف الخطوة الثانية' },
  { title: 'الخطوة الثالثة' },
]

export default function Demo() {
  return <Stepper items={items} linear={false} dir="rtl" />
}
