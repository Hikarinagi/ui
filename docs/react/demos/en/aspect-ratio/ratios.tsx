import { AspectRatio, Image, Inline, Stack, Text } from '@hina-ui/react'

const ratios = [
  { label: '1 / 1', value: 1 },
  { label: '4 / 3', value: 4 / 3 },
  { label: '16 / 9', value: 16 / 9 },
  { label: '3 / 4', value: 3 / 4 },
]

export default function Demo() {
  return (
    <Inline align="start" className="gap-4">
      {ratios.map(ratio => (
        <Stack key={ratio.label} gap="xs" className="w-32">
          <Text tone="muted" size="sm">
            {ratio.label}
          </Text>
          <AspectRatio ratio={ratio.value} className="bg-inset overflow-hidden rounded-md">
            <Image src="/sample.webp" alt="A slope on a summer afternoon" className="size-full" />
          </AspectRatio>
        </Stack>
      ))}
    </Inline>
  )
}
