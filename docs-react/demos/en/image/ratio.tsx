import { Image, Inline, Stack, Text } from '@hina-ui/react'

const ratios = [
  { label: '1 / 1', value: 1 },
  { label: '4 / 3', value: 4 / 3 },
  { label: '16 / 9', value: 16 / 9 },
]

export default function Demo() {
  return (
    <Inline align="start" className="gap-4">
      {ratios.map(ratio => (
        <Stack key={ratio.label} gap="xs" className="w-40">
          <Text tone="muted" size="sm">
            {ratio.label}
          </Text>
          <Image
            src="/sample.webp"
            alt="A slope on a summer afternoon"
            ratio={ratio.value}
            className="rounded-md"
          />
        </Stack>
      ))}
    </Inline>
  )
}
