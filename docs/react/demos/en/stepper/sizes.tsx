import { Stepper, Stack, Text, type StepperSize } from '@hina-ui/react'

const sizes: StepperSize[] = ['sm', 'md', 'lg']
const items = [
  { title: 'Step A', description: 'The first description' },
  { title: 'Step B', description: 'A longer description that wraps naturally across lines' },
  { title: 'Step C', description: 'The final description' },
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
