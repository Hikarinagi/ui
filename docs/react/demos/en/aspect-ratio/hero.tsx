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
          Covers are cropped to 3:4, so originals of any size line up.
        </Text>
      </Stack>
    </Card>
  )
}
