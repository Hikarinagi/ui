import { Stepper, Stack, Text, type StepperSize } from '@hina-ui/react'

const sizes: StepperSize[] = ['sm', 'md', 'lg']
const items = [
  { title: '步骤 A', description: '第一项的说明' },
  { title: '步骤 B', description: '第二项包含更长的说明文字，支持自然换行' },
  { title: '步骤 C', description: '最后一项的说明' },
]

export default function Demo() {
  return (
    <Stack className="w-full" gap="lg">
      {sizes.map(size => (
        <Stack key={size}>
          <Text size="sm" tone="muted">
            {size}
          </Text>
          <Stepper items={items} size={size} defaultValue={2} />
        </Stack>
      ))}
    </Stack>
  )
}
