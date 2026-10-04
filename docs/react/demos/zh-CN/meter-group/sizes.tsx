import { MeterGroup, Stack, type MeterItem } from '@hina-ui/react'

const items: MeterItem[] = [
  { label: '已读', value: 56 },
  { label: '在读', value: 19 },
]

export default function Demo() {
  return (
    <Stack gap="lg" className="w-96">
      <MeterGroup items={items} size="sm" legend={false} />
      <MeterGroup items={items} legend={false} />
      <MeterGroup items={items} size="lg" legend={false} />
    </Stack>
  )
}
