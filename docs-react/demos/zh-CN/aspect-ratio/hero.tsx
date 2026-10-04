import { AspectRatio, Card, Image, Stack, Text } from '@hina-ui/react'

export default function Demo() {
  return (
    <Card className="w-full max-w-xs" padded={false}>
      <AspectRatio ratio={3 / 4} className="overflow-hidden rounded-t-lg">
        <Image src="/sample.webp" alt="ATRI" className="size-full" />
      </AspectRatio>
      <Stack gap="xs" className="p-4">
        <Text className="font-medium">ATRI</Text>
        <Text tone="muted" size="sm">
          封面按 3:4 裁切，不同尺寸的原图都能对齐。
        </Text>
      </Stack>
    </Card>
  )
}
